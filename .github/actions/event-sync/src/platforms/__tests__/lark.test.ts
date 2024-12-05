import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as core from '@actions/core';

import { LarkPlatform } from '../lark';
import { type NotificationMessage } from '../../types';

// Mock dependencies
vi.mock('axios');
vi.mock('@actions/core');

describe('LarkPlatform', () => {
  const mockWebhookUrl = 'https://mock.webhook.url';
  const mockPersonOpenIds = {
    testuser: 'test-open-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('message formatting', () => {
    it('should format basic message correctly', async () => {
      const platform = new LarkPlatform(mockWebhookUrl);
      const message: NotificationMessage = {
        title: 'Test Title',
        content: 'Test Content',
      };

      // Mock axios.post to capture the formatted message
      vi.mocked(axios.post).mockResolvedValueOnce({ data: { ok: true } });

      await platform.send(message);

      expect(axios.post).toHaveBeenCalledWith(mockWebhookUrl, {
        msg_type: 'interactive',
        card: {
          header: {
            title: {
              tag: 'plain_text',
              content: 'Test Title',
            },
          },
          elements: [
            {
              tag: 'div',
              fields: [
                {
                  is_short: false,
                  text: {
                    tag: 'lark_md',
                    content: 'Test Content',
                  },
                },
              ],
            },
            {},
            {},
          ],
        },
      });
    });

    it('should format message with URL correctly', async () => {
      const platform = new LarkPlatform(mockWebhookUrl);
      const message: NotificationMessage = {
        title: 'Test Title',
        content: 'Test Content',
        url: 'https://test.url',
      };

      vi.mocked(axios.post).mockResolvedValueOnce({ data: { ok: true } });

      await platform.send(message);

      expect(axios.post).toHaveBeenCalledWith(
        mockWebhookUrl,
        expect.objectContaining({
          card: expect.objectContaining({
            elements: expect.arrayContaining([
              expect.objectContaining({
                tag: 'action',
                actions: [
                  {
                    tag: 'button',
                    text: {
                      tag: 'plain_text',
                      content: 'View Details',
                    },
                    type: 'primary',
                    url: 'https://test.url',
                  },
                ],
              }),
            ]),
          }),
        }),
      );
    });

    it('should format message with creator and personOpenIds correctly', async () => {
      const platform = new LarkPlatform(mockWebhookUrl, mockPersonOpenIds);
      const message: NotificationMessage = {
        title: 'Test Title',
        content: 'Test Content',
        creator: 'testuser',
      };

      vi.mocked(axios.post).mockResolvedValueOnce({ data: { ok: true } });

      await platform.send(message);

      expect(axios.post).toHaveBeenCalledWith(
        mockWebhookUrl,
        expect.objectContaining({
          card: expect.objectContaining({
            elements: expect.arrayContaining([
              expect.objectContaining({
                tag: 'note',
                elements: [
                  {
                    tag: 'lark_md',
                    content: 'creator: <at id=test-open-id></at>',
                  },
                ],
              }),
            ]),
          }),
        }),
      );
    });

    it('should handle creator without personOpenIds correctly', async () => {
      const platform = new LarkPlatform(mockWebhookUrl);
      const message: NotificationMessage = {
        title: 'Test Title',
        content: 'Test Content',
        creator: 'testuser',
      };

      vi.mocked(axios.post).mockResolvedValueOnce({ data: { ok: true } });

      await platform.send(message);

      expect(axios.post).toHaveBeenCalledWith(
        mockWebhookUrl,
        expect.objectContaining({
          card: expect.objectContaining({
            elements: expect.arrayContaining([
              expect.objectContaining({
                tag: 'note',
                elements: [
                  {
                    tag: 'lark_md',
                    content: 'creator: testuser',
                  },
                ],
              }),
            ]),
          }),
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should handle axios error correctly', async () => {
      const platform = new LarkPlatform(mockWebhookUrl);
      const message: NotificationMessage = {
        title: 'Test Title',
        content: 'Test Content',
      };

      const error = new Error('Network error');
      vi.mocked(axios.post).mockRejectedValueOnce(error);

      await platform.send(message);

      expect(core.setFailed).toHaveBeenCalledWith(
        'Failed to send message to Lark: Error: Network error.message',
      );
    });

    it('should log successful response', async () => {
      const platform = new LarkPlatform(mockWebhookUrl);
      const message: NotificationMessage = {
        title: 'Test Title',
        content: 'Test Content',
      };

      const mockResponse = { data: { ok: true } };
      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

      const consoleSpy = vi.spyOn(console, 'log');
      await platform.send(message);

      expect(consoleSpy).toHaveBeenCalledWith(mockResponse.data);
    });
  });
});
