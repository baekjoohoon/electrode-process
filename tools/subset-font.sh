#!/usr/bin/env bash
# index.html 에 실제로 쓰인 글자만 남겨 Pretendard 서브셋을 다시 만든다.
# 필요한 것: python -m pip install fonttools brotli
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="tools/PretendardVariable.woff2"
OUT="public/fonts/pretendard-subset.woff2"

if [ ! -f "$SRC" ]; then
  echo "원본 서체를 내려받습니다…"
  curl -sL -o "$SRC" \
    https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2
fi

mkdir -p public/fonts
python -m fontTools.subset "$SRC" \
  --text-file=public/index.html \
  --output-file="$OUT" \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting \
  --desubroutinize

ls -l "$OUT"
echo "완료: 페이지 문구를 고쳤다면 이 스크립트를 다시 실행하세요."
