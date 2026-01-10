const MercadoPago = require('mercadopago');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método não permitido' })
      };
    }

    const { carrinho, cliente } = JSON.parse(event.body);

    const mp = new MercadoPago({
      accessToken: process.env.MP_ACCESS_TOKEN
    });

    const items = carrinho.map(item => ({
      title: item.nome,
      quantity: Number(item.quantidade),
      currency_id: 'BRL',
      unit_price: Number(item.preco)
    }));

    const preference = await mp.preferences.create({
      body: {
        items,
        payer: {
          name: cliente.nome,
          phone: { number: cliente.telefone }
        }
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        link: preference.init_point
      })
    };

  } catch (err) {
    console.error('ERRO FUNCTION:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'erro ao criar pagamento',
        detalhe: err.message
      })
    };
  }
};
