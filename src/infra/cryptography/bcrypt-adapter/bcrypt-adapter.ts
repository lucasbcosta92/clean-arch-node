import bcrypt from 'bcrypt'

import { Hasher } from "../../../data/protocols/criptography/hasher";
import { HashComparer } from "../../../data/protocols/criptography/hash-comparer";

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) { }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}