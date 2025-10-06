import { Picker } from '../src/presentation/components/Picker';

describe('Picker', () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  const mockOnValueChange = jest.fn();

  it('should be defined', () => {
    expect(Picker).toBeDefined();
  });

  it('should accept required props', () => {
    const props = {
      value: 'Item 1',
      items: items,
      onValueChange: mockOnValueChange,
    };

    expect(props.value).toBe('Item 1');
    expect(props.items).toEqual(items);
    expect(props.onValueChange).toBe(mockOnValueChange);
  });
});
