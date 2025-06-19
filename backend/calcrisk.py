
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import sqlite3
import os
from PIL import Image
import difflib
import re
from functions import (
    set_zoom,
    latlon_to_pixel,
    generate_image_from_db,
    get_color_codes_within_bounds,
    calculate_risk_values,
    get_arv_value
)
import functions

# メイン処理で一度だけzoomを設定
set_zoom(13)

"""
住所を緯度経度の範囲に変換
"""
# APIを用いたリクエストの引数を読み取りaddressに格納する
if len(sys.argv) > 1:
    address = sys.argv[1]
else:
    address = "default address"


# コマンドライン引数などで渡された address を使用（例として sys.argv[1]）
if len(sys.argv) > 1:
    address = sys.argv[1]
else:
    print("Usage: python your_script.py <address>")
    sys.exit(1)

# location.db への接続
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'data', 'location.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()




def find_closest_address(input_address: str):
    kanji_digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    def number_to_kanji(n: int) -> str:
        """
        0〜99 の整数を漢数字に変換する関数
        例: 15 -> "十五", 10 -> "十", 21 -> "二十一"
        """
        if n < 10:
            return kanji_digits[n]
        elif n < 20:
            if n == 10:
                return "十"
            else:
                # 11〜19の場合、先頭は "十" で、その後に一の位の漢数字（例: 15 -> "十五"）
                return "十" + (kanji_digits[n % 10] if n % 10 != 0 else "")
        else:
            tens = n // 10
            ones = n % 10
            # 20以上の場合は、10の位が1でない場合に先頭に数字を付ける
            tens_part = (kanji_digits[tens] if tens > 1 else "") + "十"
            ones_part = kanji_digits[ones] if ones != 0 else ""
            return tens_part + ones_part
    def replace_func(match):
        number_str = match.group()
        try:
            number_int = int(number_str)
            return number_to_kanji(number_int)
        except ValueError:
            return number_str

    input_address = re.sub(r'\d+', replace_func, input_address)
    # addresses テーブルから住所リストを取得
    cursor.execute("SELECT address FROM addresses")
    rows = cursor.fetchall()

    # 住所だけのリストに変換
    address_list = [row[0] for row in rows]

    # difflib の get_close_matches で最も類似した住所を取得
    # n=1 にすると最も近いものだけ取得、cutoff=0.6 は類似度の下限(0~1)
    matches = difflib.get_close_matches(input_address, address_list, n=1, cutoff=0.6)

    if matches:
        return matches[0], input_address  # 最も近い住所を返す
    else:
        return None, input_address        # 類似する住所が見つからなかった

input_address = address
closest, renew_address = find_closest_address(input_address)


if closest:# 一番類似する住所がみつかれば
    # address カラムが変数 address と一致するレコードの緯度・経度を抽出するクエリ
    cursor.execute("SELECT latitude, longitude FROM addresses WHERE address = ?", (closest,))

    # 結果を取得（1件のみ取得する場合）
    result = cursor.fetchone()
    conn.close()

    latitude, longitude = result

    # 緯度経度範囲の指定（南西隅と北東隅）
    lat1 = latitude - 0.01  # 南西隅の緯度
    lon1 = longitude - 0.01  # 南西隅の経度
    lat2 = latitude + 0.01   # 北東隅の緯度
    lon2 = longitude + 0.01  # 北東隅の経度

    # 関数の定義

    # リスクデータを取得
    def calcrisk(lat1, lat2, lon1, lon2, disaster_type):
        # デバッグ用：ピクセル座標の計算
        x1, y1 = latlon_to_pixel(lat1, lon1)
        x2, y2 = latlon_to_pixel(lat2, lon2)
        # print(f"ピクセル座標: ({x1}, {y1}) と ({x2}, {y2})")

        # ピクセルデータを削除
        functions.pixel_data.clear()
        # タイル画像を取得して画像生成
        output_filename = f"backend/data/latest_output_image_{disaster_type}.png"
        generate_image_from_db(lat1, lon1, lat2, lon2, disaster_type, output_filename)

        # 範囲内の色コードを取得しリスク値を計算
        color_codes, pixelnum = get_color_codes_within_bounds(lat1, lon1, lat2, lon2)
        risk_values, landnum = calculate_risk_values(color_codes, pixelnum, disaster_type)
        if landnum == 0:
            landnum = 1
        risk = risk_values / landnum
        if disaster_type == "tsunami":
            if risk >= 2:
                rank = "大"
            elif risk >= 0.25:
                rank = "大"
            elif risk > 0:
                rank = "中"
            else:
                rank = "なし"
        else:
            if risk >= 2:
                rank = "大"
            elif risk >= 0.25:
                rank = "中"
            elif risk > 0:
                rank = "小"
            else:
                rank = "なし"

        # print(f"ピクセル数: {pixelnum}")
        # print(f"リスク値: {risk} 評価: {rank}")
        return {"pixelnum": pixelnum, "risk": risk, "rank": rank}

    #（例：洪水データの場合）
    # calcrisk(lat1, lat2, lon1, lon2, "flood")
    list = [
        'flood','earthquake','tsunami','heavysnow','dirtsand'
    ]
    available = [
        'flood','earthquake','tsunami','heavysnow','dirtsand'
    ]
    result = {}

    for disaster_type in list:
        if disaster_type in available:
            if disaster_type == 'earthquake':
                erisk = get_arv_value(latitude, longitude)
                erisk = float(erisk)
                if erisk >= 2: erank = '大'
                elif erisk >= 1: erank = '中'
                elif erisk > 0: erank = '小'
                else: erank = 'なし'
                result['earthquake'] = {'rank': erank,'risk': erisk}
            elif disaster_type == 'dirtsand':
                dirtsands = ['dirtsand1','dirtsand2','dirtsand3']
                for d in dirtsands:
                    riskdata = calcrisk(lat1, lat2, lon1, lon2, d)
                    result[d] = {'rank': riskdata['rank'], 'risk': riskdata['risk']}
                # dirtsandについて統合する
                drisk = (result['dirtsand1']['risk'] + result['dirtsand2']['risk'] + result['dirtsand3']['risk']) / 3
                if drisk > 0:
                    result['dirtsand'] = {'rank': '大','risk': drisk}
                else:
                    result['dirtsand'] = {'rank': 'なし','risk': drisk}
            else:
                riskdata = calcrisk(lat1, lat2, lon1, lon2, disaster_type)
                result[disaster_type] = {'rank': riskdata['rank'], 'risk': riskdata['risk']}
        else:
            result[disaster_type] = {'rank': '小', 'risk': 0}
    result['address'] = closest
    result['input_address'] = renew_address
    print(json.dumps(result))
    sys.stdout.flush()  # 出力をフラッシュ
    # address : 住所 、

else:
    # 例外処理,入力をやり直してください
    result = {'error' : '住所が存在しません'}
    print(json.dumps(result))
    sys.stdout.flush()  # 出力をフラッシュ
