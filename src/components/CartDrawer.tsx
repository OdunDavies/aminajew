import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-border flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl text-foreground">Your Cart</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {items.length === 0 ? "Your cart is empty" : `${items.length} item(s)`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 border-b border-border pb-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1">
                <h4 className="font-serif text-sm text-foreground">{item.product.name}</h4>
                <p className="text-xs text-muted-foreground">{item.product.material}</p>
                {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                <p className="text-sm text-primary mt-1">${item.product.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeItem(item.product.id)} className="ml-auto text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-serif">${subtotal.toLocaleString()}</span>
            </div>
            <Link to="/checkout" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 tracking-[0.1em] uppercase text-xs">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
