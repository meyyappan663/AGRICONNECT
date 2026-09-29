import os
import zipfile
import requests

engine_version_file = r"E:\flutter\bin\internal\engine.version"
with open(engine_version_file, "r") as f:
    engine_version = f.read().strip()

print(f"Target Flutter Engine Version: {engine_version}")

cache_dir = r"E:\flutter\bin\cache"
os.makedirs(cache_dir, exist_ok=True)

zip_dest = os.path.join(cache_dir, "dart-sdk-windows-x64.zip")
url = f"https://storage.flutter-io.cn/flutter_infra_release/flutter/{engine_version}/dart-sdk-windows-x64.zip"

print(f"Downloading Dart SDK from {url}...")
with requests.get(url, stream=True, timeout=60) as r:
    r.raise_for_status()
    total_size = int(r.headers.get("content-length", 0))
    downloaded = 0
    with open(zip_dest, "wb") as f:
        for chunk in r.iter_content(chunk_size=1024*1024):
            if chunk:
                f.write(chunk)
                downloaded += len(chunk)
                if total_size > 0:
                    pct = (downloaded / total_size) * 100
                    print(f"\rProgress: {pct:.1f}% ({downloaded // (1024*1024)}MB / {total_size // (1024*1024)}MB)", end="")

print("\nExtracting Dart SDK...")
with zipfile.ZipFile(zip_dest, "r") as zip_ref:
    zip_ref.extractall(cache_dir)

stamp_file = os.path.join(cache_dir, "engine-dart-sdk.stamp")
with open(stamp_file, "w") as f:
    f.write(engine_version)

print("Dart SDK successfully installed and stamped!")
