import mongoose from 'mongoose';
import { AccountModel, RoleEnum } from '@/lib/models/account.model';
import { hashSync } from 'bcryptjs';
import {ApiError} from "@/lib/common/errors/api.error";
import {
  appEnv,
  DEFAULT_ACCOUNT_EMAIL,
  DEFAULT_ACCOUNT_PASSWORD,
  DEFAULT_ACCOUNT_USERNAME,
  MONGO_URI
} from "@/lib/configs/env";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

class DbService {
  async connect() {
    if (!MONGO_URI) {
      throw new ApiError('Database not properly configured', 508);
    }

    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose
        .connect(appEnv.base.mongoUri, opts)
        .then(async (mongoose) => {
          return mongoose;
        });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }

    await DbService.generateDefaultAccount();

    return cached.conn;
  }

  private static async generateDefaultAccount() {
    if (!(await AccountModel.findOne({}))) {
      try {
        await AccountModel.create({
          username: DEFAULT_ACCOUNT_USERNAME,
          displayName: DEFAULT_ACCOUNT_USERNAME,
          email: DEFAULT_ACCOUNT_EMAIL,
          password: hashSync(DEFAULT_ACCOUNT_PASSWORD, 10),
          roles: RoleEnum.ADMIN,
          isActivated: true,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export const dbService = new DbService();

