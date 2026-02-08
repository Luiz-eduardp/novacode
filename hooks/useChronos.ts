import { useCallback, useState } from 'react';
import { ChronosHistory, ChronosSnapshot } from '../types';

export const useChronos = (fileId: string) => {
    const [histories, setHistories] = useState<Map<string, ChronosHistory>>(new Map());

    const getHistory = useCallback((fId: string): ChronosHistory | undefined => {
        return histories.get(fId);
    }, [histories]);

    const createSnapshot = useCallback(
        (fId: string, content: string, description: string = 'Alteração') => {
            setHistories(prev => {
                const newHistories = new Map(prev);
                const history = newHistories.get(fId) || {
                    fileId: fId,
                    snapshots: [],
                    currentIndex: -1
                };

                const newSnapshot: ChronosSnapshot = {
                    id: `snap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: Date.now(),
                    content,
                    description,
                    fileId: fId
                };

                const newSnapshots = history.snapshots.slice(0, history.currentIndex + 1);
                newSnapshots.push(newSnapshot);

                newHistories.set(fId, {
                    fileId: fId,
                    snapshots: newSnapshots,
                    currentIndex: newSnapshots.length - 1
                });

                return newHistories;
            });
        },
        []
    );

    const goToSnapshot = useCallback(
        (fId: string, snapshotIndex: number): string | null => {
            const history = histories.get(fId);
            if (!history || snapshotIndex < 0 || snapshotIndex >= history.snapshots.length) {
                return null;
            }

            setHistories(prev => {
                const newHistories = new Map(prev);
                const h = newHistories.get(fId);
                if (h) {
                    h.currentIndex = snapshotIndex;
                }
                return newHistories;
            });

            return history.snapshots[snapshotIndex].content;
        },
        [histories]
    );

    const goToNext = useCallback((fId: string): string | null => {
        const history = histories.get(fId);
        if (!history) return null;

        const nextIndex = Math.min(history.currentIndex + 1, history.snapshots.length - 1);
        return goToSnapshot(fId, nextIndex);
    }, [histories, goToSnapshot]);

    const goToPrevious = useCallback((fId: string): string | null => {
        const history = histories.get(fId);
        if (!history) return null;

        const prevIndex = Math.max(history.currentIndex - 1, 0);
        return goToSnapshot(fId, prevIndex);
    }, [histories, goToSnapshot]);

    const getAllSnapshots = useCallback((fId: string): ChronosSnapshot[] => {
        return histories.get(fId)?.snapshots || [];
    }, [histories]);

    const getCurrentIndex = useCallback((fId: string): number => {
        const history = histories.get(fId);
        return history?.currentIndex ?? -1;
    }, [histories]);

    const deleteSnapshot = useCallback((fId: string, snaphotId: string) => {
        setHistories(prev => {
            const newHistories = new Map(prev);
            const history = newHistories.get(fId);
            if (!history) return newHistories;

            const snaphotIndex = history.snapshots.findIndex(s => s.id === snaphotId);
            if (snaphotIndex === -1) return newHistories;

            const newSnapshots = history.snapshots.filter((_, idx) => idx !== snaphotIndex);

            let newCurrentIndex = history.currentIndex;
            if (snaphotIndex <= history.currentIndex && newCurrentIndex > 0) {
                newCurrentIndex--;
            }

            newHistories.set(fId, {
                fileId: fId,
                snapshots: newSnapshots,
                currentIndex: newCurrentIndex
            });

            return newHistories;
        });
    }, []);

    const clearHistory = useCallback((fId: string) => {
        setHistories(prev => {
            const newHistories = new Map(prev);
            newHistories.delete(fId);
            return newHistories;
        });
    }, []);

    const canUndo = useCallback((fId: string): boolean => {
        const history = histories.get(fId);
        return history ? history.currentIndex > 0 : false;
    }, [histories]);

    const canRedo = useCallback((fId: string): boolean => {
        const history = histories.get(fId);
        return history ? history.currentIndex < history.snapshots.length - 1 : false;
    }, [histories]);

    return {
        getHistory,
        createSnapshot,
        goToSnapshot,
        goToNext,
        goToPrevious,
        getAllSnapshots,
        getCurrentIndex,
        deleteSnapshot,
        clearHistory,
        canUndo,
        canRedo
    };
};
