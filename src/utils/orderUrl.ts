
export function buildOrderUrl(itemsList: Array<{ [key: string]: number }>) {
  const baseUrl = 'https://pasobo-pro.i17.bcart.jp/order_list.php';
  const params: string[] = [];

  itemsList.forEach((itemObj, index) => {
    const [id, quantity] = Object.entries(itemObj)[0];
    params.push(`items[${index}]=${encodeURIComponent(id)}`);
    params.push(`quantities[${index}]=${encodeURIComponent(quantity)}`);
  });

  return `${baseUrl}?${params.join('&')}`;
}
