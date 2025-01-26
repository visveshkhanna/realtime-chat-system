// database-client.ts
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

import { User, Chat, Message } from "./types";
import { DatabaseTable } from "./database-table";

interface DatabaseData {
  user: User[];
  chat: Chat[];
  messages: Message[];
}

export class DatabaseClient {
  private static instance: DatabaseClient | null = null;

  public static async init(fileName: string): Promise<void> {
    if (this.instance) {
      // Already initialized
      return;
    }
    // Create the instance by reading/writing the JSON file
    this.instance = await this.create(fileName);
  }

  /**
   * Retrieve the singleton instance.
   * Will throw an error if init(...) has not been called yet.
   */
  public static getInstance(): DatabaseClient {
    if (!this.instance) {
      throw new Error(
        "DatabaseClient not initialized. Call DatabaseClient.init(...) first."
      );
    }
    return this.instance;
  }

  // --- ORIGINAL LOGIC ---
  private data: DatabaseData;

  public user: DatabaseTable<User>;
  public chat: DatabaseTable<Chat>;
  public messages: DatabaseTable<Message>;

  /**
   * Private constructor so you cannot instantiate directly from outside.
   * (Use DatabaseClient.init() + DatabaseClient.getInstance() pattern)
   */
  private constructor(private fileName: string, initialData: DatabaseData) {
    this.data = initialData;

    this.user = new DatabaseTable<User>(
      () => this.data.user,
      (newData: User[]) => (this.data.user = newData),
      () => this.saveToFile()
    );

    this.chat = new DatabaseTable<Chat>(
      () => this.data.chat,
      (newData: Chat[]) => (this.data.chat = newData),
      () => this.saveToFile()
    );

    this.messages = new DatabaseTable<Message>(
      () => this.data.messages,
      (newData: Message[]) => (this.data.messages = newData),
      () => this.saveToFile()
    );
  }

  private static async create(fileName: string): Promise<DatabaseClient> {
    const absolutePath = path.resolve(fileName);

    let initialData: DatabaseData = {
      user: [],
      chat: [],
      messages: [],
    };

    if (existsSync(absolutePath)) {
      const fileContent = await fs.readFile(absolutePath, "utf-8");
      try {
        const parsed = JSON.parse(fileContent);

        initialData = {
          user: parsed.user ?? [],
          chat: parsed.chat ?? [],
          messages: parsed.messages ?? [],
        };
      } catch (error) {
        console.error("Error parsing JSON data, using empty structure:", error);
      }
    } else {
      await fs.writeFile(absolutePath, JSON.stringify(initialData, null, 2));
    }

    return new DatabaseClient(absolutePath, initialData);
  }

  private async saveToFile(): Promise<void> {
    await fs.writeFile(this.fileName, JSON.stringify(this.data, null, 2));
  }
}
