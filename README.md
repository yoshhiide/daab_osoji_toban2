# OSOJI_TOBAN2

## 機能

### 選出ルームでの機能
指定日時になると選出された結果を発表するトークルーム

- 指定日時に選出結果を発表
- 次回の指定日時に選出をなしにする

### 管理ルームでの機能
管理ルームに指定するキーワードをメッセージ送信して登録したトークルーム

- 現在の登録メンバー確認
- 登録メンバーの追加・削除
- 登録メンバーを一括登録
- アラート日時指定


## Redisデータ設計

### Key
- [admin_rooms] 管理ルームのステータス（ルームID、アクション）
- [all_members] 全ての登録済みメンバー名
- [unchosen] 現在の周期で未選出のメンバー名
- [timers] アラート時刻

### Data
```json
{
  'admin_rooms': {
    '_000000_000000': {
      room: '_222222_222222',
      action: 'MEMBER'
    },
    '_111111_111111': {
      room: '_333333_333333',
      action: 'START_TIME_HOUR'
    }
  },
  'all_members': {
    '_000000_000000': [
      '一郎',
      '二郎',
      '三郎',
      '四郎',
      '五郎'
    ],
    '_111111_111111': [
      '一郎',
      '二郎',
      '三郎'
    ]
  },
  'unchosen': {
    '_000000_000000': [
      '一郎',
      '二郎'
    ],
    '_111111_111111': [
      '一郎'
    ]
  },
  'timers': {
    '_000000_000000': {
      'choose': 3,
      'week': '3',
      'start': {
        'message': 'お掃除開始します！\n今週のお掃除担当者は・・・',
        'hour': 18,
        'minute': 30
      },
      'end': {
        'message': '終了。用がない人は帰宅するように。',
        'hour': 18,
        'minute': 40
      }
    },
    '_111111_111111': {
      'choose': 1,
      'week': '1-5',
      'start': {
        'message': '始業です！\n今日の昼飯注文担当者は・・・',
        'hour': 9,
        'minute': 30
      },
      'end': {
        'message': '本日も１日お疲れ様でした。',
        'hour': 18,
        'minute': 30
      }
    }
  }
}
```

### action kind
- MEMBER
- CHOOSE
- WEEK
- START_MESSAGE
- START_HOUR
- START_MINUTE
- END_MESSAGE
- END_HOUR
- END_MINUTE
