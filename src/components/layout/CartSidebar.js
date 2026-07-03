import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { useCartStore, useLangStore } from '../../lib/store';
import { formatPrice } from '../../lib/utils';
import { locales } from '../../data/locales';
import gamesData from '../../data/games.json';
import RetroButton from '../ui/RetroButton';

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { lang } = useLangStore();
  const t = locales[lang];

  useEffect(() => {
    const handleToggle = (e) => {
      setIsOpen(e.detail);
    };

    window.addEventListener('toggle-cart', handleToggle);
    return () => window.removeEventListener('toggle-cart', handleToggle);
  }, []);

  if (!isOpen) return null;

  // Resolve full game objects
  const cartItems = cart.map((item) => {
    const game = gamesData.find((g) => g.id === item.gameId);
    return {
      ...item,
      title: game ? game.title[lang] || game.title['en'] : 'Unknown Game',
      price: game ? game.price : 0,
      image: game ? game.image : '',
    };
  }).filter(item => item.price > 0 || item.title !== 'Unknown Game');

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    Swal.fire({
      title: t.wizardConfirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t.alertYes,
      cancelButtonText: t.alertNo,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#475569',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
      customClass: {
        popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
        confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-purple-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
        cancelButton: 'font-press text-[9px] uppercase px-4 py-2 bg-slate-500 border-2 border-slate-950 shadow-retro-sm rounded-none',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Trigger confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });

        // Format message
        let msg = `*🛍️ INVOICE ORDER - SUKAMAJU HUB*\n`;
        msg += `===============================\n`;
        msg += `Language: ${lang.toUpperCase()}\n`;
        msg += `Date: ${new Date().toLocaleDateString()}\n\n`;
        msg += `*ITEMS ORDERED:*\n`;

        cartItems.forEach((item) => {
          msg += `- ${item.title} (Qty: ${item.quantity}) - ${formatPrice(item.price * item.quantity, lang)}\n`;
        });

        msg += `\n*TOTAL PRICE:* ${formatPrice(totalPrice, lang)}\n`;
        msg += `===============================\n`;
        msg += `Please process this order. Thank you!`;

        // Redirect to WhatsApp
        const waUrl = `https://wa.me/6285817048266?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');

        // Success Alert
        Swal.fire({
          title: t.wizardSuccessTitle,
          text: t.wizardSuccessText,
          icon: 'success',
          confirmButtonColor: '#9333ea',
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
          customClass: {
            popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
            confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-purple-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
          }
        });

        clearCart();
        setIsOpen(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-inter">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-white dark:bg-slate-950 border-l-4 border-slate-950 dark:border-slate-100 flex flex-col shadow-2xl transition-transform duration-300 h-full text-slate-900 dark:text-slate-100">
          
          {/* Header */}
          <div className="p-4 border-b-4 border-slate-950 dark:border-slate-100 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
            <h2 className="font-press text-xs uppercase tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-rose-500 inline-block animate-blink"></span>
              {t.cartTitle}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 border-2 border-slate-950 dark:border-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12 px-6">
                <div className="w-16 h-16 border-4 border-dashed border-slate-400 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-600 font-press text-xl">
                  ?
                </div>
                <p className="font-press text-[9px] uppercase leading-relaxed text-slate-550 dark:text-slate-400">
                  {t.cartEmpty}
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.gameId}
                  className="flex gap-3 p-3 border-2 border-slate-950 dark:border-slate-100 shadow-retro-sm bg-slate-50 dark:bg-slate-900 relative"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover border-2 border-slate-950 dark:border-slate-100 bg-slate-200"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-press text-[9px] uppercase tracking-tighter truncate text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h4>
                      <p className="font-press text-[9px] text-purple-600 dark:text-cyan-400 mt-1">
                        {formatPrice(item.price, lang)}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.gameId, item.quantity - 1)}
                        className="w-6 h-6 border-2 border-slate-950 dark:border-slate-100 flex items-center justify-center bg-white dark:bg-slate-800 text-[10px] font-bold"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-press text-[10px] w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.gameId, item.quantity + 1)}
                        className="w-6 h-6 border-2 border-slate-950 dark:border-slate-100 flex items-center justify-center bg-white dark:bg-slate-800 text-[10px] font-bold"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.gameId)}
                    className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-500"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                </div>
              ))
            )}
          </div>

          {/* Footer Billing Details */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t-4 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-900 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-press text-[9px] uppercase tracking-wide text-slate-700 dark:text-slate-350">
                  {t.cartTotal}:
                </span>
                <span className="font-press text-xs text-purple-600 dark:text-cyan-400 font-bold">
                  {formatPrice(totalPrice, lang)}
                </span>
              </div>
              
              <RetroButton
                variant="purple"
                fullWidth
                size="md"
                onClick={handleCheckout}
              >
                {t.cartCheckout}
              </RetroButton>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
