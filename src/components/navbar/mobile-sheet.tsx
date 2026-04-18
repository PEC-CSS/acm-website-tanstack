import { Drawer } from "@base-ui/react/drawer";

interface IMobileDrawerProps {
  handle: Drawer.Handle<unknown>;
  children: React.ReactNode;
}

export function MobileDrawer({ handle, children }: IMobileDrawerProps) {
  return (
    <Drawer.Root
      handle={handle}
      swipeDirection="right"
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="sm:hidden fixed inset-0 z-40 bg-black/20 data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity duration-150" />
        <Drawer.Viewport className="sm:hidden fixed inset-0 z-40 flex items-end">
          <Drawer.Popup className="w-full h-full bg-gray-200 transform-[translateY(var(--drawer-swipe-movement-y))] transition-transform duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] data-starting-style:transform-[translateX(100%)] data-ending-style:transform-[translateX(100%)]">
            <Drawer.Content className="h-full pb-18">{children}</Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
