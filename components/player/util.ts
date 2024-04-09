export function findMatchingItem(currentTime: number, data: any[]) {
    const _currentTime = currentTime * 1000
    const index = data.findIndex(item => _currentTime >= item.offsets.from && _currentTime <= item.offsets.to)
    return index === -1 ? 0 : index;
}