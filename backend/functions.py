"""
関数置き場（DBを使用せず、メモリ上の辞書でデータを保持）
"""

import os
import requests
from PIL import Image
from io import BytesIO
import math


# 内部的なズームレベル（初期値は任意）
_zoom = 13

def set_zoom(new_zoom):
    """メインから一度だけ呼び出し、ズームレベルを設定する"""
    global _zoom
    _zoom = new_zoom

def fetch_tile(x, y, disaster_type):
    """指定された x, y タイル座標の画像を取得する"""
    urltype = ''
    if disaster_type == 'flood':
        urltype = "01_flood_l2_shinsuishin_data"
    elif disaster_type == 'tsunami':
        urltype = '04_tsunami_newlegend_data'
    elif disaster_type == 'heavysnow':
        urltype = '05_nadarekikenkasyo'
    elif disaster_type == 'dirtsand1':
        urltype = '05_kyukeishakeikaikuiki'
    elif disaster_type == 'dirtsand2':
        urltype = '05_dosekiryukeikaikuiki'
    elif disaster_type == 'dirtsand3':
        urltype = '05_jisuberikeikaikuiki'
    url_template = f"https://disaportaldata.gsi.go.jp/raster/{urltype}/{_zoom}/{x}/{y}.png"
    url_template_sea = f"https://cyberjapandata.gsi.go.jp/xyz/pale/{_zoom}/{x}/{y}.png"
    # URLの中で_zoomを使うのでformatで埋め込み
    url_tile = url_template.format(_zoom=_zoom)
    url_tile_sea = url_template_sea.format(_zoom=_zoom)
    response = requests.get(url_tile)
    response_sea = requests.get(url_tile_sea)
    if response.status_code != 200 or response_sea.status_code != 200:
        return None, None, x, y
    return Image.open(BytesIO(response.content)), Image.open(BytesIO(response_sea.content)), x, y


# メモリ上のピクセルデータ（キー：(pixel_x, pixel_y), 値：color_code）
pixel_data = {}
def process_tile(x_tile, y_tile, disaster_type):
    """タイル画像を取得し、ピクセルデータをメモリ上の辞書に保存する"""
    if disaster_type == "dirtsand":
        image, image2, image3, image_sea, x_tile, y_tile = fetch_tile(x_tile, y_tile, disaster_type)
        print("image:", image)
        print("image2:", image2)
        print("image3:", image3)
    else:
        image, image_sea, x_tile, y_tile = fetch_tile(x_tile, y_tile, disaster_type)

    # disaster_typeがdirtsandの場合、3種類のうちどれか1つでも取得できなければ終了する
    if disaster_type == "dirtsand":
        if image is None and image2 is None and image3 is None:
            return
    else:
        if image is None or image_sea is None:
            return  # 画像が取得できなかった場合は終了
    # 通常タイルのピクセルデータを処理
    image = image.convert("RGB")
    pixels = list(image.getdata())
    for i, color in enumerate(pixels):
        color_hex = "#{:02x}{:02x}{:02x}".format(*color[:3])
        a = i % image.width
        b = i // image.width
        pixel_x = x_tile * 256 + a
        pixel_y = y_tile * 256 + b
        pixel_data[(pixel_x, pixel_y)] = color_hex

    # 淡色地図の水色（海・池・川）のピクセルを上書き
    image_sea = image_sea.convert("RGB")
    pixels_sea = list(image_sea.getdata())
    for i, color in enumerate(pixels_sea):
        color_hex = "#{:02x}{:02x}{:02x}".format(*color[:3])
        if color_hex == "#bed2ff":
            a = i % image_sea.width
            b = i // image_sea.width
            pixel_x = x_tile * 256 + a
            pixel_y = y_tile * 256 + b
            pixel_data[(pixel_x, pixel_y)] = color_hex



def latlon_to_pixel(lat, lon, zoom_level=None):
    """緯度経度を指定された（または内部の）ズームレベルのピクセル座標に変換する"""
    z = zoom_level if zoom_level is not None else _zoom
    lat_rad = math.radians(lat)
    n = 2.0 ** z
    pixel_x = int((lon + 180.0) / 360.0 * 256 * n)
    pixel_y = int((1.0 - math.log(math.tan(lat_rad) + (1 / math.cos(lat_rad))) / math.pi) / 2.0 * 256 * n)
    return pixel_x, pixel_y


def get_pixels_within_bounds(lat1, lon1, lat2, lon2):
    """指定された緯度経度範囲内のピクセルデータを辞書から取得する"""
    x1, y1 = latlon_to_pixel(lat1, lon1)
    x2, y2 = latlon_to_pixel(lat2, lon2)
    x_min, x_max = min(x1, x2), max(x1, x2)
    y_min, y_max = min(y1, y2), max(y1, y2)

    results = []
    for (px, py), color in pixel_data.items():
        if x_min <= px <= x_max and y_min <= py <= y_max:
            results.append((px, py, color))
    return results


def fetch_and_store_tiles(lat1, lon1, lat2, lon2, disaster_type):
    """指定された緯度経度範囲内のタイルを取得し、ピクセルデータをメモリ上に保存する"""
    x1, y1 = latlon_to_pixel(lat1, lon1)
    x2, y2 = latlon_to_pixel(lat2, lon2)
    # タイル座標の範囲を計算
    x_tile_start = x1 // 256
    x_tile_end = x2 // 256
    y_tile_start = y1 // 256
    y_tile_end = y2 // 256
    # print(f"xタイル: {x_tile_start} -> {x_tile_end}")
    # print(f"yタイル: {y_tile_start} -> {y_tile_end}")
    for x_tile in range(x_tile_start, x_tile_end + 1):
        for y_tile in range(y_tile_end, y_tile_start + 1):
            # print(f"タイル座標: {x_tile}, {y_tile}")
            process_tile(x_tile, y_tile, disaster_type)


def generate_image_from_db(lat1, lon1, lat2, lon2, disaster_type, output_filename):
    """指定した緯度経度範囲のピクセルデータを取得し、PNG画像を生成する
    flood,tsunami,dirtsand1,dirtsand2..."""
    fetch_and_store_tiles(lat1, lon1, lat2, lon2, disaster_type)
    pixels = get_pixels_within_bounds(lat1, lon1, lat2, lon2)

    if not pixels:
        # print("データがありません。黒の画像を生成します。")
        width = 256
        height = 256
        img = Image.new("RGB", (width, height), "black")
        img.save(output_filename)
        return

    x_values = [p[0] for p in pixels]
    y_values = [p[1] for p in pixels]
    x_min, x_max = min(x_values), max(x_values)
    y_min, y_max = min(y_values), max(y_values)

    width = x_max - x_min + 1
    height = y_max - y_min + 1
    img = Image.new("RGB", (width, height), "black")

    for x, y, color in pixels:
        rgb = tuple(int(color[i:i+2], 16) for i in (1, 3, 5))
        img.putpixel((x - x_min, y - y_min), rgb)

    img.save(output_filename)
    # print(f"画像を {output_filename} に保存しました。")


def latlon_to_pixelrange(lat1, lon1, lat2, lon2, zoom_level=None):
    """緯度経度を指定された（または内部の）ズームレベルのピクセル座標に変換する"""
    x1, y1 = latlon_to_pixel(lat1, lon1, zoom_level)
    x2, y2 = latlon_to_pixel(lat2, lon2, zoom_level)
    return (min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2))


def get_color_codes_within_bounds(lat1, lon1, lat2, lon2):
    """指定された緯度経度範囲内の色コードを取得する"""
    x_min, y_min, x_max, y_max = latlon_to_pixelrange(lat1, lon1, lat2, lon2)

    codes = []
    for (px, py), color in pixel_data.items():
        if x_min <= px <= x_max and y_min <= py <= y_max:
            codes.append(color)
    num = (x_max - x_min) * (y_max - y_min)
    return codes, num


def calculate_risk_values(color_codes, pixelnum, disaster_type):
    """色コードのリストからリスク合計値と陸地ピクセル数を計算する"""
    risk = 0
    risk_values = {}
    countnotblack = False
    if disaster_type == 'flood' or disaster_type == 'tsunami':
        risk_values = {
            '#ffffb3': 1,
            '#f7f5a9': 2,
            '#f8e1a6': 4,
            '#ffd8c0': 8,
            '#ffb7b7': 16,
            '#ff9191': 32,
            '#f285c9': 64,
            '#dc7adc': 128
        }
    elif disaster_type == 'heavysnow':
        # 1ピクセルでもあれば高リスク判定
        risk_values = {
            '#ffff65': 131072
        }
    elif disaster_type == 'dirtsand1' or disaster_type == 'dirtsand2' or disaster_type == 'dirtsand3':
        # 1ピクセルでもあれば高リスク判定
        countnotblack = 131072
    landnum = 0
    for color in color_codes:
        if color == '#bed2ff':
            continue
        landnum += 1
        if countnotblack != False:
            if color == '#000000':
                continue
            risk += countnotblack
        elif color in risk_values:
            risk += risk_values[color]
        #elif color != '#000000':
            # print(f"不明なリスク値 : {color}")
    return risk, landnum



# 地震のリスク診断に用いる
# 指定緯度経度の地震の増幅率計算
def get_arv_value(lat, lon):
    """
    指定した緯度と経度に基づき、J-SHIS API から ARV の値を取得する関数

    Args:
        lat (float): 緯度
        lon (float): 経度

    Returns:
        str: ARVの値（例: "1.45"）

    Raises:
        requests.exceptions.HTTPError: APIリクエストに失敗した場合
        ValueError: レスポンスに期待するデータが含まれない場合
    """
    # APIエンドポイントの作成（緯度経度は position パラメータに "lon,lat" の形式で渡す）
    api_url = f"https://www.j-shis.bosai.go.jp/map/api/sstrct/V4/meshinfo.geojson?position={lon},{lat}&epsg=4612"

    # GETリクエストの送信
    response = requests.get(api_url)
    response.raise_for_status()  # HTTPエラーがあればここで例外発生

    # レスポンスをJSON形式としてパース
    data = response.json()

    # featuresリストの存在確認
    features = data.get("features", [])
    if not features:
        raise ValueError("featuresが見つかりません。")

    # 最初のフィーチャのpropertiesからARVの値を取得
    properties = features[0].get("properties", {})
    arv_value = properties.get("ARV")
    if arv_value is None:
        raise ValueError("ARVの値が見つかりません。")

    return arv_value
