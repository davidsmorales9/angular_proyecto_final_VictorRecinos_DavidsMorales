import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getItem<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];

      const parsed: unknown = JSON.parse(data);
      return Array.isArray(parsed) ? parsed as T[] : [];
    } catch (error) {
      console.error(`Error al leer ${key}:`, error);
      return [];
    }
  }

  setItem<T>(key: string, value: T[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
