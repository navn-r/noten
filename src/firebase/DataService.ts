export default class DataService {
  private static _instance: DataService;

  // Lazy Singleton
  constructor() {
    if (DataService._instance) {
      return DataService._instance;
    }
    DataService._instance = this;
  }
}
