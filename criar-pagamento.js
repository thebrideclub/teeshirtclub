export async function handler(event) {
  try {
    const { carrinho, cliente } = JSON.parse(event.body);

    const items = carrinho.map(item => ({
      title: item.nome,
      quantity: item.quantidade,
      unit_price: Number(item.preco),
      currency_id: 'BRL'
    }));

    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          payer: {
            name: cliente.nome
          },
          back_urls: {
            success: 'https://teeshirtclub.netlify.app/sucesso.html',
            failure: 'https://teeshirtclub.netlify.app/erro.html'
          },
          auto_return: 'approved'
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ link: data.init_point })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'erro ao criar pagamento' })
    };
  }
}
