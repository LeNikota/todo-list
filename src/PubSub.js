export const PubSub = {
  events: {},

  subscribe(eventName, func) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(func);
  },
  unsubscribe(eventName, func) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((currentFunc) => currentFunc !== func);
    }
  },
  publish(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((func) => {
        func(data);
      });
    }
  },
};
