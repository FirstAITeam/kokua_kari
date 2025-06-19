import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import sqlite3
import os
from PIL import Image
import difflib
import re

# 住所検索機能
# Input: 住所
# Output: 最も近い住所なければエラーを返す

# コマンドライン引数などで渡された address を使用（例として sys.argv[1]）
if len(sys.argv) > 1:
    address = sys.argv[1]
else:
    print(json.dumps({
        'exists': False,
        'error': '住所が指定されていません',
        'address': '',
        'input_address': ''
    }))
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
                return "十" + (kanji_digits[n % 10] if n % 10 != 0 else "")
        else:
            tens = n // 10
            ones = n % 10
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

    try:
        input_address = re.sub(r'\d+', replace_func, input_address)
        # addresses テーブルから住所リストを取得
        cursor.execute("SELECT address FROM addresses")
        rows = cursor.fetchall()

        # 住所だけのリストに変換
        address_list = [row[0] for row in rows]

        # difflib の get_close_matches で最も類似した住所を取得
        matches = difflib.get_close_matches(input_address, address_list, n=1, cutoff=0.6)

        if matches:
            return matches[0], input_address
        else:
            return None, input_address
    except Exception as e:
        print(json.dumps({
            'exists': False,
            'error': f'住所検索中にエラーが発生しました: {str(e)}',
            'address': '',
            'input_address': input_address
        }))
        sys.exit(1)

try:
    closest, renew_address = find_closest_address(address)

    if closest:
        result = {
            'exists': True,
            'address': closest,
            'input_address': renew_address
        }
    else:
        result = {
            'exists': False,
            'error': '住所が見つかりませんでした',
            'address': '',
            'input_address': renew_address
        }

    print(json.dumps(result))
    sys.stdout.flush()
except Exception as e:
    print(json.dumps({
        'exists': False,
        'error': f'予期せぬエラーが発生しました: {str(e)}',
        'address': '',
        'input_address': address
    }))
    sys.exit(1)
finally:
    conn.close()
