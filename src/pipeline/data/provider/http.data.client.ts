import axios from 'axios';
import * as FormData from 'form-data';
import { inject, injectable } from 'inversify';
import fetch from 'node-fetch';
import { TYPES } from '../../types';
import { KeyValueData } from '../dto/key.value.data';
import { KeyFileData } from '../dto/key.file.data';
import { TaskResult } from '../dto/task.result';
import { CommitDocument } from '../dto/commit.document';
import { AttachFile } from '../dto/attach.file';
import { SystemError } from '../../command/exception/system-error';
import { DataRule } from '../dto/data-rule';
import { KeyData } from '../dto/key.data';
import { KeysValuesData } from '../dto/keys.values.data';

@injectable()
export class HttpDataClient {
  private readonly _servicePath = '/v1/store';
  private readonly _serviceUrl: string;

  constructor(@inject(TYPES.DataServiceUrl) serviceUrl: string) {
    this._serviceUrl = serviceUrl;
  }

  /**
   * Put array to store with context.
   * Used in the import command.
   * @param context
   * @param data
   */
  async putAll(context: string, data: KeysValuesData): Promise<void> {
    try {
      const rawResponse = await fetch(
        `${this._serviceUrl}${this._servicePath}/append`,
        {
          method: 'POST',
          headers: {
            userUuid: data.userUuid,
          },
          body: JSON.stringify(data),
        },
      );
      await rawResponse.json();
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `putAll data is failed: ${e?.response?.data?.message || e.message}`,
      );
    }
  }

  /**
   * Put key-value data to store.
   * @param data
   */
  async put(data: KeyValueData): Promise<void> {
    try {
      const config = {
        headers: {
          userUuid: data.userUuid,
        },
      };
      const res = await axios.post(
        `${this._serviceUrl}${this._servicePath}`,
        data,
        config,
      );
      if (!res.data.success) {
        throw new SystemError(res.data.message);
      }
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `put data is failed: ${e?.response?.data?.message || e.message}`,
      );
    }
  }

  /**
   * Get value by key of store.
   * @param data
   */
  async get(data: KeyData): Promise<any> {
    try {
      const config = {
        headers: {
          userUuid: data.userUuid,
        },
      };
      const url = `${this._serviceUrl}${this._servicePath}/get`;
      const res = await axios.post(url, data, config);
      if (!res.data) {
        throw new SystemError(res.data.message);
      }
      return res.data;
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `get data is failed: ${e?.response?.data?.message || e.message}`,
      );
    }
  }

  /**
   * Remove value from store by key.
   * @param data
   */
  async remove(data: KeyData): Promise<void> {
    try {
      const config = {
        headers: {
          userUuid: data.userUuid,
        },
      };
      const url = `${this._serviceUrl}${this._servicePath}/remove`;
      const res = await axios.post(url, data, config);
      if (!res.data.success) {
        throw new SystemError(res.data.message);
      }
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `remove data is failed: ${e?.response?.data?.message || e.message}`,
      );
    }
  }

  /**
   * Attach file in user folder with command context.
   * @param data
   */
  async putFile(data: KeyFileData): Promise<string> {
    try {
      const url = new URL(
        `${this._serviceUrl}${this._servicePath}/upload/${data.id}/${data.context}/${data.fileExtension}/${data.key}`,
      );
      const form = new FormData();
      const file = data.file;
      form.append('file', file, { filename: 'file' });
      const config = {
        headers: {
          ...form.getHeaders(),
          userUuid: data.userUuid,
        },
      };
      const result = await axios.post(url.href, form, config);
      return result.data && result.data.link;
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `putFile data is failed: ${e?.response?.data?.message || e.message}`,
      );
    }
  }

  /**
   * Attach file without context but in user folder.
   * Return file public link.
   * @param data
   */
  async attachFile(data: AttachFile): Promise<string> {
    try {
      const url = new URL(
        `${this._serviceUrl}${this._servicePath}/attach/${data.id}/${data.fileExtension}`,
      );
      const form = new FormData();
      const file = data.file;
      form.append('file', file, { filename: 'file' });
      const response = await fetch(url.href, {
        method: 'POST',
        headers: {
          ...form.getHeaders(),
          userUuid: data.userUuid,
          metadata: JSON.stringify(data.metadata),
        },
        body: form,
      });
      const result = await response.json();
      console.log(result);
      return result && (result as any).file;
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `attachFile data is failed: ${e?.response?.data?.message || e.message}`,
      );
    }
  }

  /**
   * Freezing all data and return.
   * @param data
   */
  async commit(data: CommitDocument): Promise<TaskResult> {
    try {
      const res = await axios.post(
        `${this._serviceUrl}${this._servicePath}/commit`,
        data,
      );
      return res.data;
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `commit data is failed: ${e?.response?.data?.message || e.message}`,
      );
    }
  }

  /**
   * Sets data rules to storage.
   * @param config
   */
  async setDataRules(config: {
    rules: Array<DataRule>;
    storageId: string;
  }): Promise<void> {
    try {
      await axios.post(`${this._serviceUrl}${this._servicePath}/rule`, config);
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `commit data is failed: ${e?.response?.data?.message || e.message}`,
      );
    }
  }

  /**
   * Replace data macros, example ${line.[key]}.
   * @param config
   */
  async replaceMacros(config: {
    context: string;
    id: string;
    inputWithMacros: string;
  }): Promise<any> {
    try {
      const res = await axios.post(
        `${this._serviceUrl}${this._servicePath}/replace-macros`,
        {
          inputWithMacros: config.inputWithMacros,
          context: config.context,
          id: config.id,
        },
      );
      if (res?.data?.message) {
        throw new SystemError(
          `request 'replaceMacros' is failed: ${res.data.message}`,
        );
      } else if (res.status >= 400) {
        throw new SystemError(`request 'replaceMacros' is failed: ${res.data}`);
      }
      return res.data;
    } catch (e) {
      console.error(e);
      throw new SystemError(
        `request 'replaceMacros' is failed: ${
          e?.response?.data?.message || e.message
        }`,
      );
    }
  }
}
