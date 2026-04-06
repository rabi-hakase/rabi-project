// ============================================================
// messages.js — 全メッセージテキスト定義
// {{ }} はGPTで生成した本文に差し替えてください
// ============================================================

import { QUESTIONS, RESULT_TYPES } from './diagnosis.js';

// ── 初回メッセージ ─────────────────────────────────────────

export const MSG_WELCOME = [
  `はじめまして！ラビ博士です🔬

30〜40代男性の恋愛の「なぜうまくいかないか」を9問で診断します。

所要時間：約2分
選択肢の中から、一番近いものを選んでください。

準備ができたら「スタート」と送ってください。`,
];

export const MSG_START_BUTTON = {
  text: '準備ができたら「スタート」と送ってください。',
  items: [{ label: 'スタートする', text: 'スタート' }],
};

// ── 診断中 ────────────────────────────────────────────────

/**
 * 質問メッセージを生成する
 * @param {number} index 0始まり
 * @returns {{ text: string, items: Array }}
 */
export function buildQuestionMessage(index) {
  const q = QUESTIONS[index];
  const text = `【Q${index + 1}/9】${q.text}`;
  const items = q.choices.map(c => ({
    label: c.label,
    text: c.key,
  }));
  return { text, items };
}

// ── 結果 Flex Message ─────────────────────────────────────

/**
 * 診断結果の Flex Message contents を生成する
 * @param {string} resultType — L1/L2/K1/K2/A1/A2
 * @returns {{ altText: string, contents: object }}
 */
export function buildResultFlex(resultType) {
  const rt = RESULT_TYPES[resultType];
  if (!rt) return { altText: '診断結果', contents: _errorBubble() };

  const detail = RESULT_DETAIL_TEXT[resultType] || '';
  const [hookLine, ...rest] = detail.split('\n').filter(l => l.trim());

  return {
    altText: `診断結果：${rt.name}`,
    contents: {
      type: 'bubble',
      size: 'giga',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#08080f',
        paddingAll: '20px',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: '🔬 診断結果',
                size: 'xs',
                color: '#e83e8c',
                weight: 'bold',
                flex: 0,
              },
            ],
          },
          {
            type: 'text',
            text: rt.name,
            size: 'xl',
            weight: 'bold',
            color: '#f0f0f8',
            wrap: true,
            margin: 'md',
          },
          {
            type: 'text',
            text: rt.short,
            size: 'sm',
            color: '#7070a0',
            wrap: true,
            margin: 'sm',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0d0d1a',
        paddingAll: '20px',
        spacing: 'lg',
        contents: [
          // フックライン
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#111120',
            cornerRadius: '12px',
            paddingAll: '16px',
            contents: [
              {
                type: 'text',
                text: hookLine || '',
                size: 'md',
                weight: 'bold',
                color: '#f0f0f8',
                wrap: true,
                lineSpacing: '6px',
              },
            ],
          },
          // 残りの本文
          {
            type: 'text',
            text: rest.join('\n') || '',
            size: 'sm',
            color: '#aaaacc',
            wrap: true,
            lineSpacing: '6px',
          },
          // 区切り線
          {
            type: 'separator',
            color: '#252540',
          },
          // CTA テキスト
          {
            type: 'text',
            text: '📄 分析レポートをこのトークに送りました\nこのまま下にスクロールして確認してください',
            size: 'sm',
            color: '#f0f0f8',
            wrap: true,
            lineSpacing: '4px',
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#08080f',
        paddingAll: '16px',
        contents: [
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'noteで続きを読む',
              text: 'note見る',
            },
            style: 'primary',
            color: '#e83e8c',
            height: 'md',
          },
        ],
      },
    },
  };
}

function _errorBubble() {
  return {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: '診断結果を取得できませんでした。', wrap: true },
      ],
    },
  };
}

// ── タイプ別詳細テキスト（GPTで差し替え） ─────────────────

const RESULT_DETAIL_TEXT = {
  L1: `「いい感じなのに、なぜか友人止まり。」

誠実さも気遣いもある。なのに選ばれない。
問題は性格ではなく、感情が動く余地を与えていないことにあります。

安心感と恋愛感情は、脳の別の回路で動きます。
誠実さをいくら磨いても、恋愛対象にはなれない理由がここにあります。

なぜそうなるのか、無料コンテンツで解説します。`,

  L2: `「嫌われてはいない。でも、選ばれない。」

気遣いが強すぎて、自分の存在感が薄くなっています。
踏み込める場面でも引いてしまうため、好意も温度も相手に届いていない。

嫌われることを避けようとした結果、
選ばれる機会ごと消えています。

なぜそうなるのか、無料コンテンツで解説します。`,

  K1: `「少し好感触があると、一気に気持ちが入る。」

これは性格の問題ではありません。
好意を持った後の「情報のフィルタリング」の問題です。

普通の反応を「脈あり」として受け取りやすく、
相手との温度差が気づかないうちに広がっていきます。

なぜそうなるのか、無料コンテンツで解説します。`,

  K2: `「返信が遅い。少しそっけない。それだけで崩れる。」

相手の反応の変化を強く受け取り、不安が先に膨らむ。
恋愛そのものより、不安の管理に消耗しているのがこのタイプです。

これは意志力でどうにかなるものではなく、
認知の構造的な問題です。

なぜそうなるのか、無料コンテンツで解説します。`,

  A1: `「真面目にやっているのに、マッチしない。」

中身の問題ではありません。
写真やプロフィール文が「情報の羅列」になっており、
「会ってみたい」というイメージが湧かない状態になっています。

アプリは自分をよく見せる場所ではなく、
相手に想像させる場所です。

なぜ届かないのか、無料コンテンツで解説します。`,

  A2: `「マッチはする。でも、会えない。」

やり取りは始まるのに流れが止まる。
誘うタイミング、会話のテンポ、その先の設計にズレがあります。

「楽しかった」だけで終わり、次につながらない。
どこで失速しているのかを、無料コンテンツで解説します。`,
};

// ── 限定コンテンツ配信 ────────────────────────────────────

/**
 * 限定コンテンツメッセージを生成する
 * @param {string} resultType
 * @param {object} content — limitedContents.json の1エントリ
 * @returns {string[]}
 */
export function buildLimitedContentMessages(resultType, content, pdfUrl) {
  const msg1 = `🎁 限定コンテンツをご用意しました

【${content.title}】

あなたのタイプに合わせた内容をまとめています。
保存して、じっくり読んでみてください。`;

  const msg2 = pdfUrl
    ? `📄 こちらからお受け取りください\n\n${pdfUrl}`
    : `📄 準備中です。もうしばらくお待ちください。`;

  const msg3 = buildNoteTeaser(resultType);

  return [msg1, msg2, msg3];
}

function buildNoteTeaser(resultType) {
  const teasers = {
    L1: `無料コンテンツでは「なぜそうなるか」を解説しました。

次のnoteでは「どう変えるか」を具体的に解説しています。

▶ 誠実さを捨てずに、恋愛対象として見られる動き方
▶ 印象を残す会話の構造
▶ 関係を前進させる「最小限の行動設計」

誠実さを捨てずに、恋愛対象として見られる動き方になります。`,

    L2: `無料コンテンツでは「なぜそうなるか」を解説しました。

次のnoteでは「どう変えるか」を具体的に解説しています。

▶ 遠慮しながら好意を届ける言葉の出し方
▶ 「踏み込めない」を解除する段階的アプローチ
▶ 関係を前進させる「最小限の行動設計」

やさしさがちゃんと相手に届くようになります。`,

    K1: `無料コンテンツでは「なぜそうなるか」を解説しました。

次のnoteでは「どう変えるか」を具体的に解説しています。

▶ 脈ありと礼儀を区別する「証拠の質」の見方
▶ 期待が高まったときこそ一歩引く理由
▶ 感情ではなく設計で動く恋愛の作り方

同じ失敗を繰り返さなくなります。`,

    K2: `無料コンテンツでは「なぜそうなるか」を解説しました。

次のnoteでは「どう変えるか」を具体的に解説しています。

▶ ネガティブサインを誤読しないための事実ログ
▶ 確認行動をやめるための行動切り替えリスト
▶ 相手の反応に依存しない判断軸の作り方

消耗しない恋愛に変わります。`,

    A1: `無料コンテンツでは「なぜそうなるか」を解説しました。

次のnoteでは「どう変えるか」を具体的に解説しています。

▶ 「正確だが魅力的でない」プロフィールの直し方
▶ 写真1枚の選び方で変わるマッチ率
▶ 「会ってみたい」と思わせる文章の設計

プロフィールを変えれば、今日から結果が変わります。`,

    A2: `無料コンテンツでは「なぜそうなるか」を解説しました。

次のnoteでは「どう変えるか」を具体的に解説しています。

▶ 3〜5往復で会う約束を取る会話設計
▶ 「盛り上がりの瞬間」を逃さない誘い方
▶ デート後に次をつなぐ一言

設計を変えれば、同じアプリで結果が変わります。`,
  };

  return teasers[resultType] || teasers['L1'];
}

// ── note誘導 ──────────────────────────────────────────────

/**
 * note URLメッセージを生成する
 * @param {object} note — paidNotes.json の1エントリ
 * @returns {string}
 */
export function buildNoteMessage(note) {
  if (note.url) {
    return `📖 ${note.title}

¥980 / 読了10〜15分

診断結果に合わせた「あなた専用の処方箋」です。
同じ失敗を繰り返さないために、一度だけ読んでおいてください。

▶ ${note.url}`;
  }
  return `📖 ${note.title}

現在、最終調整中です。
公開次第このトークでお知らせします。もう少しだけお待ちください。`;
}

// ── その他 ────────────────────────────────────────────────

export const MSG_INVALID_CHOICE = '選択肢の中から「A」「B」「C」のいずれかで答えてください。';

export const MSG_ERROR = '申し訳ありません、エラーが発生しました。もう一度「スタート」と送ってみてください。';

export const MSG_UNKNOWN = `メッセージありがとうございます。

診断を受けたい方は「スタート」と送ってください。`;
