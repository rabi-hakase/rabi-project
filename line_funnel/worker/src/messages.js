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
            text: '📄 限定コンテンツをこのトークに送りました\nまずこれだけ確認してください。自分のズレがどこで起きているかがわかります。',
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
              label: '限定コンテンツを読む',
              text: '結果を受け取る',
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
  L1: `「感じはいい。でも、後に残らない。」
その止まり方を何度もしているなら、このタイプの可能性が高いです。

会話は問題ない。嫌われてもいない。
でも、印象に残る前に関係が終わってしまう。

誠実さや気遣いがあっても選ばれにくいのは、性格が悪いからではありません。
安心感を与える動きはできている一方で、恋愛として意識されるための余白が生まれにくくなっていることがあります。

なぜそうなるのか、限定コンテンツで整理します。`,

  L2: `「やさしい。でも、気持ちが伝わらない。」
この止まり方が繰り返されているなら、このタイプです。

会いたいのに誘えない。好意があるのに、相手には温度が見えない。
気づけば何も起きないまま終わっている。

気遣いが強すぎると、自分の存在感が薄くなりやすいです。
踏み込める場面でも引いてしまい、好意も温度も相手に届かなくなっていることがあります。

なぜそうなるのか、限定コンテンツで整理します。`,

  K1: `「少し好感触があると、一気に気持ちが入る。」
このパターンが繰り返されているなら、このタイプです。

脈ありと思って動いた。でも相手は普通に接していただけだった。
その温度差が、気づかないうちに広がっていきます。

これは気持ちの弱さではありません。
好意を持ったあとに、相手の反応を前向きに読みやすくなる状態です。

なぜそうなるのか、限定コンテンツで整理します。`,

  K2: `「返信が遅い。少しそっけない。それだけで崩れる。」
この消耗が繰り返されているなら、このタイプです。

返信が2時間来なかっただけで、頭から離れなくなる。
恋愛そのものより、不安の管理に消耗しているのがこのタイプです。

これは気合いの問題ではありません。相手の反応を基準にしすぎて、気持ちが揺れやすくなっている状態です。

なぜそうなるのか、限定コンテンツで整理します。`,

  A1: `「真面目にやっているのに、マッチしない。」
この状況が続いているなら、このタイプです。

写真も選んだ。プロフィールも書いた。
それでも、マッチしない。何が違うのかわからない。

中身の問題ではありません。
写真やプロフィール文が「情報の羅列」になっており、「会ってみたい」というイメージが湧かない状態になっています。

なぜそうなるのか、限定コンテンツで整理します。`,

  A2: `「マッチはする。でも、会えない。」
このパターンが何度も続いているなら、このタイプです。

返信は来る。会話も続く。
でも、会う約束だけがいつも決まらない。

相手とのやり取りが悪いわけではありません。
誘うタイミング、会話のテンポ、その先の設計にズレがある状態です。

どこで失速しているのかを、限定コンテンツで整理します。`,
};

// ── 限定コンテンツ配信 ────────────────────────────────────

/**
 * 限定コンテンツメッセージを生成する
 * @param {string} resultType
 * @param {object} content — limitedContents.json の1エントリ
 * @returns {string[]}
 */
export function buildLimitedContentMessages(resultType, content, pdfUrl) {
  const msg1 = `🎁 限定コンテンツをお渡しします。

これは、あなたが同じ失敗を繰り返しやすい理由を短時間で整理するための内容です。

まずはここで「何がズレていたのか」を確認してください。
このあとnoteを見る前に読んでおくと、自分に必要な改善点がはっきりします。

【${content.title}】`;

  const msg2 = pdfUrl
    ? `📄 こちらからお受け取りください\n\n${pdfUrl}`
    : `📄 準備中です。もうしばらくお待ちください。`;

  const msg3 = buildNoteTeaser(resultType);

  return [msg1, msg2, msg3];
}

function buildNoteTeaser(resultType) {
  const teasers = {
    L1: `では、誠実さを保ちながら恋愛対象として見られる動き方に変えるには？

この先のnoteでは、
「感じはいいのに終わる」を止めるために、
何をやめて、何を足せばいいかを具体的に整理しています。`,

    L2: `では、やさしさを保ちながら好意が届く動き方に変えるには？

この先のnoteでは、
「温度が伝わらないまま終わる」を止めるために、
踏み込み方と好意の出し方を具体的に整理しています。`,

    K1: `では、同じ空回りを繰り返さない判断の仕方に変えるには？

この先のnoteでは、
「期待が先走る」を止めるために、
何を事実として見て、何を保留するかを具体的に整理しています。`,

    K2: `では、相手の反応に左右されない軸を持つには？

この先のnoteでは、
「小さな変化で崩れる」を止めるために、
相手以外に判断の基準を置く方法を具体的に整理しています。`,

    A1: `では、「会ってみたい」と思わせるプロフィールに変えるには？

この先のnoteでは、
「マッチしない入口設計」を変えるために、
写真と自己紹介文の直し方を具体的に整理しています。`,

    A2: `では、会うまでの流れを設計するには？

この先のnoteでは、
「やり取りは続くのに会えない」を止めるために、
誘うタイミングと流れの作り方を具体的に整理しています。`,
  };

  return teasers[resultType] || teasers['L1'];
}

// ── note誘導 ──────────────────────────────────────────────

/**
 * note URLメッセージを生成する
 * @param {object} note — paidNotes.json の1エントリ
 * @param {string} [resultType] — L1/L2/K1/K2/A1/A2
 * @returns {string}
 */
export function buildNoteMessage(note, resultType) {
  const typeDescriptions = {
    L1: 'いい人止まり・無難化型の人が最初に変えるべきポイントだけに絞っています。',
    L2: 'いい人止まり・遠慮過多型の人が最初に変えるべきポイントだけに絞っています。',
    K1: '期待先行・妄想先行型の人が同じ失敗を繰り返さないための内容に絞っています。',
    K2: '期待先行・不安過敏型の人が不安を持ち込まないための内容に絞っています。',
    A1: 'アプリ失速・プロフ弱者型の人がマッチ率を変えるための内容に絞っています。',
    A2: 'アプリ失速・会話失速型の人が会うまでの流れを変えるための内容に絞っています。',
  };
  const typeClosings = {
    L1: '悪くないのに選ばれない流れを変えたいなら、ここを読んでください。',
    L2: '好意が伝わらないまま終わる流れを止めたいなら、ここを読んでください。',
    K1: '脈ありの誤読で空回りする癖を止めたいなら、ここを読んでください。',
    K2: '相手の反応に振り回されない軸を持ちたいなら、ここを読んでください。',
    A1: '真面目にやっているのにマッチしない状態を変えたいなら、ここを読んでください。',
    A2: 'やり取りは続くのに会えない流れを変えたいなら、ここを読んでください。',
  };
  const typeDesc = typeDescriptions[resultType] || '診断結果に合わせた内容に絞っています。';
  const typeClosing = typeClosings[resultType] || '次に同じ失敗を繰り返さないために、一度だけ読んでおいてください。';

  if (note.url) {
    return `📖 ${note.title}

${typeDesc}
${typeClosing}

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
