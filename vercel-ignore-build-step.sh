if [ "$VERCEL_GIT_COMMIT_REF" != "main" ] ; then
  echo "現在のブランチ ($VERCEL_GIT_COMMIT_REF) は本番ブランチではないため、ビルドをスキップします。"
  exit 0;
fi