(() => {
  const root = document.querySelector('[data-km-menu]');
  if (!root) return;

  const STORAGE_KEY = 'kombi-coffee-cart-v1';
  const groups = {
    sizes: { name: 'Size', values: [['Regular', 0], ['Large', 250]] },
    milks: { name: 'Milk', values: [['Fresh milk', 0], ['Oat milk', 200], ['Coconut milk', 150], ['No milk', 0]] },
    sweet: { name: 'Sweetness', values: [['No sugar', 0], ['Light', 0], ['Regular', 0], ['Extra sweet', 0]] },
    hot: { name: 'Temperature', values: [['Warm', 0], ['Hot', 0], ['Extra hot', 0]] },
    ice: { name: 'Ice', values: [['Regular ice', 0], ['Light ice', 0], ['No ice', 0]] },
    serve: { name: 'Serving', values: [['Dine in', 0], ['Takeaway', 0]] }
  };
  const g = (name, values) => ({ name, values });
  const items = [
    ['espresso-solo','Espresso Solo','hot',1050,'Double espresso softened with silky steamed milk and a thin cap of microfoam.',['Vegetarian','Popular'],'☕','var(--coffee-gold)','images/menu/espresso single.jpg',[groups.sizes,groups.milks,groups.sweet,groups.hot]],
    ['espresso-double','Espresso Double','hot',1100,'Equal parts bold double espresso and warm textured milk—small, balanced and strong.',['Vegetarian'],'🚐','var(--kombi-red)','images/menu/espresso double.jpg',[groups.milks,groups.sweet,groups.hot]],
    ['cappuccino','Cappuccino','hot',1250,'Espresso, steamed milk, Ceylon cinnamon and a gentle cardamom finish.',['House special'],'✦','var(--soft-beige)','images/menu/cappucino.jpg',[groups.sizes,groups.milks,groups.sweet,groups.hot]],
    ['latte','Latte','hot',1250,'Dark chocolate folded into espresso and steamed milk, finished with cocoa dust.',['Chocolate','Vegetarian'],'🍫','var(--tropical-green)','images/menu/latte.jpg',[groups.sizes,groups.milks,groups.sweet,groups.hot]],
    ['flat white','Flat White','hot',1250,'Black tea simmered with ginger, cinnamon, cardamom and creamy steamed milk.',['No coffee','Spiced'],'🫖','var(--coffee-gold)','images/menu/flat white.jpg',[groups.sizes,groups.milks,groups.sweet,groups.hot]],
    ['matcha latte','Matcha Latte','hot',1450,'Smooth cocoa and warm milk with tiny marshmallows; served at a kid-friendly warmth.',['Kids','No coffee'],'☁️','var(--soft-beige)','images/menu/matcha latte.jpg',[groups.milks,groups.sweet]],
    ['americano',"Americano",'hot',1100,'Slow-steeped local coffee with a naturally smooth, chocolatey finish over ice.',['Vegan','Strong'],'🧊','var(--coffee-brown)','images/menu/americano.jpg',[groups.sizes,groups.ice,groups.sweet,groups.milks]],
    ['hot chocolate','Hot Chocolate','hot',1450,'Double espresso poured over cold milk and ice for an easy tropical-day coffee.',['Vegetarian','Popular'],'🥤','var(--coffee-gold)','images/menu/hot chocolate.jpg',[groups.sizes,groups.milks,groups.sweet,groups.ice]],
    ['long black','Long black','hot',1100,'Cold brew shaken with coconut milk and a light coconut foam cap.',['Vegan','House special'],'🥥','var(--soft-beige)','images/menu/long black.jpg',[groups.sizes,groups.sweet,groups.ice]],
    ['macchiato','Macchiato','hot',1150,'Sparkling tonic, fresh lime and a bright espresso float—crisp and surprising.',['Vegan','Refreshing'],'🍋','var(--tropical-green)','images/menu/macchiato.jpg',[groups.sizes,groups.ice,groups.sweet]],
    ['ristretto','Ristretto','hot',1050,'Ceylon black tea, ripe mango and lime shaken cold over plenty of ice.',['Vegan','No coffee'],'🥭','var(--kombi-red)','images/menu/ristretto.jpg',[groups.sizes,groups.sweet,groups.ice]],
    ['cortado','Cortado','hot',1150,'Passionfruit, lime, mint and sparkling water for a tart tropical lift.',['Vegan','Caffeine free'],'🌿','var(--coffee-gold)','images/menu/cortado.jpg',[groups.sizes,groups.sweet,groups.ice]],
    ['espresso con panna','Espresso Con Panna','hot',1250,'Thick toasted sourdough with whipped honey butter, cinnamon and a pinch of sea salt.',['Vegetarian'],'🍞','var(--coffee-gold)',[g('Spread',[['Honey butter',0],['Peanut butter',0],['Plain butter',0]]),'images/menu/espresso-con-panna.jpg',groups.serve]],
    ['egg-sambol','Kombi Egg & Sambol Bun','sides',1100,'Soft bun filled with fried egg, cheese and a mild house coconut sambol.',['Local favourite','Mild spice'],'🍳','var(--kombi-red)',[g('Spice',[['Mild',0],['Medium',0],['Hot',0]]),groups.serve]],
    ['avo-toast','Jungle Avocado Toast','sides',1450,'Sourdough, smashed avocado, tomato, lime and toasted seeds.',['Vegan','Fresh'],'🥑','var(--tropical-green)',[g('Add-on',[['No add-on',0],['Fried egg',250],['Feta',300]]),groups.serve]],
    ['tropical-bowl','Tropical Yoghurt Bowl','sides',1350,'Thick yoghurt, seasonal fruit, toasted coconut, granola and local honey.',['Vegetarian','Fresh'],'🥣','var(--soft-beige)',[g('Base',[['Dairy yoghurt',0],['Coconut yoghurt',200]]),groups.serve]],
    ['banana-loaf','Roasted Banana Loaf','bakery',650,'Moist banana loaf with brown sugar, cinnamon and toasted cashews.',['Vegetarian','Contains nuts'],'🍌','var(--coffee-gold)',[g('Serving',[['As is',0],['Warmed',0],['Warmed + butter',100]])]],
    ['cinnamon-roll','Kombi Cinnamon Roll','bakery',850,'Soft-baked swirl layered with Ceylon cinnamon and a light vanilla glaze.',['Vegetarian','Popular'],'🌀','var(--kombi-red)',[g('Serving',[['As is',0],['Warmed',0]])]],
    ['coconut-cookie','Coconut Jaggery Cookie','bakery',450,'Chewy coconut cookie sweetened with kithul jaggery and a touch of sea salt.',['Vegan','Local flavour'],'🍪','var(--soft-beige)',[g('Quantity',[['One',0],['Pack of 3',800]])]],
    ['pineapple-tart','Spiced Pineapple Tart','bakery',700,'Buttery pastry filled with pineapple, ginger and warm island spices.',['Vegetarian'],'🍍','var(--tropical-green)',[g('Serving',[['As is',0],['Warmed',0]])]]
  ].map(([id,name,category,price,description,tags,icon,visual,image,options]) => ({id,name,category,price,description,tags,icon,visual,image,options}));
  const categoryLabels = { all: 'All menu', hot: 'Hot drinks', cold: 'Cold drinks', sides: 'Café sides', bakery: 'Bakery' };
  let category = 'all';
  let cart = loadCart();
  let selected = null;
  let choices = {};

  const money = value => `LKR ${new Intl.NumberFormat('en-LK').format(value)}`;
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  function loadCart() { try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
  function saveCart() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
  function getTotal() { return cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0); }

  const cards = root.querySelector('[data-km-cards]');
  const search = root.querySelector('[data-km-search]');
  const heading = root.querySelector('[data-km-heading]');
  const results = root.querySelector('[data-km-results]');
  const empty = root.querySelector('[data-km-empty]');
  const modalShell = root.querySelector('[data-km-modal]');
  const cartShell = root.querySelector('[data-km-cart]');

  function renderMenu() {
    const term = search.value.trim().toLowerCase();
    const visible = items.filter(item => (category === 'all' || item.category === category) && (!term || `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(term)));
    heading.textContent = categoryLabels[category];
    results.textContent = `${visible.length} items`;
    empty.style.display = visible.length ? 'none' : 'block';
    cards.innerHTML = visible.map(item => `<article class="km-card"><div class="km-card-visual" style="--visual:${item.visual}" aria-hidden="true"><img src="${item.image}" alt="${escapeHtml(item.name)}"></div><div class="km-card-body"><div class="km-card-top"><h3>${escapeHtml(item.name)}</h3><span class="km-price">from ${money(item.price)}</span></div><p class="km-desc">${escapeHtml(item.description)}</p><div class="km-card-foot"><div class="km-tags">${item.tags.map(tag => `<span class="km-tag">${escapeHtml(tag)}</span>`).join('')}</div><button class="km-add" type="button" data-add="${item.id}" aria-label="Customize and add ${escapeHtml(item.name)}">+</button></div></div></article>`).join('');
  }

  function openModal(item) {
    selected = item;
    choices = Object.fromEntries(item.options.map(group => [group.name, group.values[0][0]]));
    root.querySelector('[data-km-modal-title]').textContent = item.name;
    root.querySelector('[data-km-modal-desc]').textContent = item.description;
    root.querySelector('[data-km-options]').innerHTML = item.options.map(group => `<fieldset class="km-option-group"><legend>${escapeHtml(group.name)}</legend><div class="km-options">${group.values.map(([label, price], index) => `<label class="km-choice"><input type="radio" name="km-${escapeHtml(group.name)}" value="${escapeHtml(label)}" ${index === 0 ? 'checked' : ''}><span>${escapeHtml(label)}${price ? `<small>+${money(price)}</small>` : ''}</span></label>`).join('')}</div></fieldset>`).join('');
    root.querySelector('[data-km-note]').value = '';
    updateModalPrice();
    modalShell.classList.remove('km-hidden');
    document.body.classList.add('km-modal-open');
  }
  function updateModalPrice() {
    const extra = selected.options.reduce((sum, group) => sum + (group.values.find(([label]) => label === choices[group.name])?.[1] || 0), 0);
    root.querySelector('[data-km-modal-add]').textContent = `Add to order · ${money(selected.price + extra)}`;
  }
  function closeModal() { modalShell.classList.add('km-hidden'); document.body.classList.remove('km-modal-open'); selected = null; }
  function openCart() { renderCart(); cartShell.classList.remove('km-hidden'); document.body.classList.add('km-modal-open'); }
  function closeCart() { cartShell.classList.add('km-hidden'); document.body.classList.remove('km-modal-open'); }

  function renderCart() {
    const count = cart.reduce((sum, line) => sum + line.quantity, 0);
    root.querySelector('[data-km-cart-count]').textContent = count;
    const body = root.querySelector('[data-km-cart-body]');
    const foot = root.querySelector('[data-km-cart-foot]');
    if (!cart.length) {
      body.innerHTML = '<div class="km-cart-empty"><div><span>🚐</span><strong>Your order is empty</strong><p>Add something delicious from the menu.</p></div></div>';
      foot.classList.add('km-hidden');
      return;
    }
    body.innerHTML = cart.map((line, index) => `<div class="km-cart-line"><div class="km-line-top"><strong>${escapeHtml(line.name)}</strong><span class="km-line-price">${money(line.unitPrice * line.quantity)}</span></div><p class="km-line-choices">${Object.values(line.choices).map(escapeHtml).join(' · ')}${line.note ? ` · “${escapeHtml(line.note)}”` : ''}</p><div class="km-line-actions"><div class="km-stepper"><button type="button" data-qty="-1" data-index="${index}" aria-label="Remove one ${escapeHtml(line.name)}">−</button><span>${line.quantity}</span><button type="button" data-qty="1" data-index="${index}" aria-label="Add one ${escapeHtml(line.name)}">+</button></div><button class="km-remove" type="button" data-remove="${index}">Remove</button></div></div>`).join('');
    root.querySelector('[data-km-total]').textContent = money(getTotal());
    foot.classList.remove('km-hidden');
  }
  function addSelected() {
    if (!selected) return;
    const note = root.querySelector('[data-km-note]').value.trim();
    const extra = selected.options.reduce((sum, group) => sum + (group.values.find(([label]) => label === choices[group.name])?.[1] || 0), 0);
    const key = `${selected.id}-${JSON.stringify(choices)}-${note.toLowerCase()}`;
    const match = cart.find(line => line.key === key);
    if (match) match.quantity += 1;
    else cart.push({ key, itemId: selected.id, name: selected.name, quantity: 1, unitPrice: selected.price + extra, choices: {...choices}, note });
    saveCart(); closeModal(); openCart();
  }
  function summary() {
    const lines = cart.map((line, index) => `${index + 1}. ${line.quantity} × ${line.name} (${Object.values(line.choices).join(', ')})${line.note ? ` · Note: ${line.note}` : ''} — ${money(line.unitPrice * line.quantity)}`);
    return ['KOMBI COFFEE CABIN — ORDER','',...lines,'',`TOTAL: ${money(getTotal())}`,'','Pickup at the Kombi · Habarana'].join('\n');
  }

  root.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.category) { category = target.dataset.category; root.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button === target))); renderMenu(); }
    if (target.dataset.add) openModal(items.find(item => item.id === target.dataset.add));
    if (target.matches('[data-km-build]')) openModal(items[0]);
    if (target.matches('[data-km-open-cart]')) openCart();
    if (target.matches('[data-km-close-modal]')) closeModal();
    if (target.matches('[data-km-close-cart]')) closeCart();
    if (target.matches('[data-km-modal-add]')) addSelected();
    if (target.dataset.qty) { const line = cart[Number(target.dataset.index)]; if (line) line.quantity += Number(target.dataset.qty); cart = cart.filter(entry => entry.quantity > 0); saveCart(); renderCart(); }
    if (target.dataset.remove) { cart.splice(Number(target.dataset.remove), 1); saveCart(); renderCart(); }
    if (target.matches('[data-km-clear]')) { cart = []; saveCart(); renderCart(); }
    if (target.matches('[data-km-copy]')) { const text = summary(); const done = () => { target.textContent = 'Order copied!'; setTimeout(() => { target.textContent = 'Copy order summary'; }, 2500); }; if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => window.prompt('Copy your order summary:', text)); else window.prompt('Copy your order summary:', text); }
  });
  root.addEventListener('change', event => { if (event.target.matches('.km-choice input') && selected) { const group = selected.options.find(option => `km-${option.name}` === event.target.name); if (group) choices[group.name] = event.target.value; updateModalPrice(); } });
  search.addEventListener('input', renderMenu);
  modalShell.querySelector('.km-modal-veil').addEventListener('click', closeModal);
  cartShell.querySelector('.km-cart-veil').addEventListener('click', closeCart);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeModal(); closeCart(); } });
  renderMenu(); renderCart();
})();

