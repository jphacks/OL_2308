# どれすたいる（Dresstyle）

[![IMAGE ALT TEXT HERE](https://github.com/jphacks/OL_2308/assets/97429973/de098745-55b0-447e-b0d5-aae8dc0b7cf2)](https://www.youtube.com/watch?v=yYRQEdfGjEg)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
通販で服を買うのって悩みませんか？時間がかかって結局買うのやめたりしてませんか？
服の購入やその日の服装決め、購入した服装の管理に関する悩みは誰もが抱いたことがあるのではないでしょうか？

そんな日常と切っても切り離せないファッションの悩みを解決すべく、私たちは「どれすたいる」を開発しました！

特に私たちは技術の選定からこだわり抜き、最新の論文から服の「仮想試着機能」を実装しています！
その他にも服の提案機能、GPTによる相談機能、服装を画像データで管理するクローゼット機能、通販検索機能などファッションのあらゆる悩みを解消する機能を搭載し、ユーザビリティの高いUIの設計にも注力しました。

本アプリケーションがあなたのファッションの悩みを解消し、誰もがストレスなくファッションを楽しめる機会を提供できれば幸いです。

### 製品説明（具体的な製品の説明）
通販で服を購入する際や、服装の管理、服装決めなどファッションの悩み事を解消するWebアプリケーションです！

### 説明動画
[![image](https://github.com/jphacks/OL_2308/assets/131255118/b8e7951b-cdc4-4933-ab58-38f3a1c54c0f)](https://youtu.be/ROW1sZBFbMY)


### 特長
#### 1.仮想試着機能
通販上にある服装を自分の画像に試着させることが可能です。この機能で、自分に合う服装を楽しく効率的に見つけましょう！
![](https://github.com/jphacks/OL_2308/assets/131255118/1d67afe6-4a81-4573-8e78-ec9f5bb51777)

実際に使用している動画はこちら↓


https://github.com/jphacks/OL_2308/assets/131255118/9a4d4d43-bf1f-4119-86c3-0d6497de7610



#### 2.服装検索機能
性別、季節、年齢、場面、フリーワードの条件から、ファッションを検索する機能です。お気に入りのファッションを見つけ、あなたの服装の参考にしましょう！
![image](https://github.com/jphacks/OL_2308/assets/131255118/eabf6c47-ebcb-4566-8dc5-e2adcc634410)


#### 3.クローゼット機能
自分の持っている服装や、仮想試着で気に入ったお気に入りのコーディネート、服装検索機能で見つけた画像などを管理できます。これで、タンスの奥に入れたまま忘れてしまうような服装はなくなるでしょう
![image](https://github.com/jphacks/OL_2308/assets/131255118/6cb41d5e-707e-4354-a100-027aaa328d2d)


他人のコーディネートから服装を抽出することも可能です！「自分には似合うかわからない」そんな悩みを解消しましょう！
![image](https://github.com/jphacks/OL_2308/assets/131255118/89edde10-634e-4e17-a453-501ff0a0abbe)


#### 4.通販検索機能
Webアプリケーション内で、他のファッション通販サイトを閲覧できます。仮想試着で欲しくなった服装はすぐに購入可能です！
![image](https://github.com/jphacks/OL_2308/assets/131255118/59324dce-f405-4fed-b936-78099fd9e535)


#### 5.GPTによるアシスタント機能
GPTにあなたの悩みを相談できます。本アプリの使い方から、ファッションに関する悩みなど、なんでも相談してみてください！
![image](https://github.com/jphacks/OL_2308/assets/131255118/5cba129e-9507-4a1b-8289-d753d59ec0af)

### 仮想試着技術に使用したモデル概要
LaDI-VTON

拡散モデルとCLIP（視覚言語モデル）を使用し、服のマスク部分から指定した服装の画像を生成するモデルとなっています。

![image](https://github.com/jphacks/OL_2308/assets/97216326/a45ccdbb-1467-4554-ae71-caece21076e1)

引用：https://arxiv.org/pdf/2305.13501.pdf


### 解決出来ること
- WEB上の服装をその場で試着可能！
- あなたの要望から服装をご提案！もう服装に迷わない！
- みんなのコーデからの服の抽出，試着，お気に入りへの追加まで，フレキシブルでストレスフリーな利用が可能！
- 自分が何を持っているか考えなくていい！あなたの服をすべて管理！
### 今後の展望
* ユーザーのいいね履歴から，関連するコーディネートをレコメンドしてくれる機能
* PostgreSQLやMySQLなどの，データベースの導入
* サーバへのデプロイ(AWSの構築など)
* Dockerを用いた，開発環境，本番環境の管理
### 注力したこと（こだわり等）
* エンドユーザー視点に立ち自分たちの欲しい機能を追求し実装した
* 技術の選定にこだわり抜き、最新の論文技術を実装した。
* GPT-3.5APIを使用し，アプリに関する質問になんでも答えてくれる機能を実装した
* 開発作業においてChatGPTを用いた画像生成やコーディングによる効率化を図り，様々な機能を実装できた
* 適宜ローディング画面を挟むことにより，ユーザーに違和感を感じさせないつくりを実装した

## 開発技術
### 活用した技術
#### API・データ
* 拡散モデル
* GPT-3.5-turbo

#### フレームワーク・ライブラリ・モジュール
* Flask
* Next.js

#### デバイス
* PC

### References
LaDI-VTON
* https://github.com/miccunifi/ladi-vton
