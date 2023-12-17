import db from '../models/index.mjs'
import base from './index.mjs'

export async function seedUsers() {
  await handleSeed(base.getBaseUser, db.User)
}

const handleSeed = async (getBase, Model) => {
  const seeder = await getBase();
  await Model.deleteMany({});
  await Model.create([...seeder]);
}