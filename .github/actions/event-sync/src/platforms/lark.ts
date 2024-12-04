import axios from 'axios';
import * as core from '@actions/core';

import { type NotificationMessage, type NotificationPlatform } from '../types';

export class LarkPlatform implements NotificationPlatform {
  constructor(private webhookUrl: string) {}

  private formatMessage(message: NotificationMessage) {
    return {
      msg_type: 'post',
      content: {
        post: {
          zh_cn: {
            title: message.title,
            content: [
              [
                {
                  tag: 'text',
                  text: `${message.content}\n`,
                },
              ],
              message.url
                ? [
                    {
                      tag: 'a',
                      text: '点击查看',
                      href: message.url,
                    },
                  ]
                : [],
              message.creator
                ? [
                    {
                      tag: 'text',
                      text: `\n创建者: ${message.creator}`,
                    },
                  ]
                : [],
            ],
          },
        },
      },
    };
  }

  async send(message: NotificationMessage): Promise<void> {
    try {
      const formattedMessage = this.formatMessage(message);
      const res = await axios.post(this.webhookUrl, formattedMessage);
      console.log(res.data);
    } catch (error) {
      core.setFailed(
        `Failed to send message to Lark: ${error as Error}.message`,
      );
    }
  }
}
