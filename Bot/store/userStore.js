class UserStore {
  constructor() {
    this.userStates = {};
    this.userTokens = {};
  }

  initializeUser(userId) {
    if (!this.userStates[userId]) {
      this.userStates[userId] = {
        step: "none",
        data: {}
      };
    }
    return this.userStates[userId];
  }

  getUserState(userId) {
    return this.userStates[userId] || this.initializeUser(userId);
  }

  setUserState(userId, step, data = null) {
    const user = this.initializeUser(userId);
    user.step = step;
    if (data) {
      user.data = data;
    }
  }

  getUserData(userId) {
    return this.getUserState(userId).data || {};
  }

  updateUserData(userId, newData) {
    const user = this.initializeUser(userId);
    user.data = { ...user.data, ...newData };
  }

  clearUserData(userId) {
    const user = this.initializeUser(userId);
    user.data = {};
  }

  clearSelectedMuseum(userId) {
    const user = this.getUserState(userId);
    if (user.data) {
      delete user.data.selectedMuseum;
      delete user.data.museums;
    }
  }

  getUserToken(userId) {
    return this.userTokens[userId];
  }

  setUserToken(userId, token) {
    this.userTokens[userId] = token;
  }

  removeUserToken(userId) {
    delete this.userTokens[userId];
  }
}

module.exports = new UserStore();