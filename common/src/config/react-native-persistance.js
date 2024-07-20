function getReactNativePersistence(storage) {
    const STORAGE_AVAILABLE_KEY = '__sak';
    const LOCAL = 'LOCAL';
    class Persistence {
      static type = LOCAL;
      type = LOCAL;
      async _isAvailable() {
        try {
          if (!storage) {
            return false;
          }
          await storage.setItem(STORAGE_AVAILABLE_KEY, '1');
          await storage.removeItem(STORAGE_AVAILABLE_KEY);
          return true;
        } catch {
          return false;
        }
      }
  
      _set(key, value) {
        return storage.setItem(key, JSON.stringify(value));
      }
  
      async _get(key) {
        const json = await storage.getItem(key);
        return json ? JSON.parse(json) : null;
      }
  
      _remove(key) {
        return storage.removeItem(key);
      }
  
      _addListener(_key, _listener) {
        return;
      }
  
      _removeListener(_key, _listener) {
        return;
      }
    }
  
    return Persistence;
  }

  export { getReactNativePersistence };