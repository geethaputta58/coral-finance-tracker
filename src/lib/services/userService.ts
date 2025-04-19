
import { User } from '../types';
import { loadData } from '../utils/storage';
import { currentUserId, sampleUser } from '../utils/sampleData';

export const getUserData = (): User => {
  const users = loadData<User>('users', [sampleUser]);
  return users.find(user => user.id === currentUserId) || sampleUser;
};
