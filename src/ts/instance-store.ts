import type { NiceAlertInstance } from './nice-alert-instance';
import type { NiceAlertResult } from '../types';

let currentInstance: NiceAlertInstance | null = null;

export function setCurrentInstance(instance: NiceAlertInstance | null): void {
    currentInstance = instance;
}

export function getCurrentInstance(): NiceAlertInstance | null {
    return currentInstance;
}

export function closeCurrentInstance(
    result?: Partial<NiceAlertResult>
): void {
    currentInstance?.close(result || { isDismissed: true });
}