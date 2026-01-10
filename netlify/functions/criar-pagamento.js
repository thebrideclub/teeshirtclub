export async function handler(event) {
  try {
    const { carrinho, cliente } = JSON.parse(event.body);

    const items = carrinho.map(item => ({
      title: item.nome,
      quantity: Number(item.quantidade),
      unit_price: Number(item.preco),
      currency_id: 'BRL'
    }));

    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
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

    if (!response.ok) {
      console.error('Mercado Pago erro:', data);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ link: data.init_point })
    };

  } catch (err) {
    console.error('Erro interno:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'erro ao criar pagamento' })
    };
  }
}
