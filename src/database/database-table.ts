export class DatabaseTable<T extends { id: string }> {
  constructor(
    private getData: () => T[],
    private setData: (newData: T[]) => void,
    private saveToFile: () => Promise<void>
  ) {}

  public async find(predicate?: (item: T) => boolean): Promise<T | null> {
    const allItems = this.getData();
    if (!predicate) return null;
    const res = allItems.filter(predicate);
    if (res.length === 0) return null;
    return res[0];
  }

  public async create(item: T): Promise<T> {
    const allItems = this.getData();
    allItems.push(item);
    this.setData(allItems);
    await this.saveToFile();
    return item;
  }

  public async update(
    id: string,
    updatedFields: Partial<T>
  ): Promise<T | null> {
    const allItems = this.getData();
    const index = allItems.findIndex((item) => item.id === id);

    if (index === -1) return null;

    const existingItem = allItems[index];
    const updatedItem = { ...existingItem, ...updatedFields };
    allItems[index] = updatedItem;

    this.setData(allItems);
    await this.saveToFile();
    return updatedItem;
  }

  public async delete(id: string): Promise<boolean> {
    const allItems = this.getData();
    const index = allItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    allItems.splice(index, 1);
    this.setData(allItems);
    await this.saveToFile();
    return true;
  }
}
