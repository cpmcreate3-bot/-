const express = require('express');
const cors = require('cors');
// აქ ჩაისმევა შენი Stripe-ის ტესტური საიდუმლო გასაღები (Secret Key)
const stripe = require('stripe')('sk_test_51Px...შენი_ტესტური_გასაღები...');

const app = express();
app.use(cors());
app.use(express.json());

// გადახდის სესიის შექმნის API ენდპოინტი
app.post('/create-checkout-session', async (req, res) => {
    const { items } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'gel', // ლარი (GEL)
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100, // თეთრებში გადაყვანა
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: 'http://localhost:5500/success.html', // წარმატებული გადახდისას
            cancel_url: 'http://localhost:5500/cancel.html',   // გაუქმებისას
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('სერვერი გაეშვა პორტზე 3000 (http://localhost:3000)'));