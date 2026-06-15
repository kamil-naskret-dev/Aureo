import { Sheet, SheetContent } from '@aureo/ui';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';

import { ArchivedProvider } from '../../features/bookmarks/context/ArchivedContext';
import { DashboardProvider } from '../../features/bookmarks/context/DashboardContext';
import { SearchProvider } from '../../features/bookmarks/context/SearchContext';
import { AddBookmarkModal } from '../../features/bookmarks/components/AddBookmarkModal';
import { DashboardNav } from '../../features/bookmarks/components/DashboardNav';
import { Sidebar } from '../../features/bookmarks/components/Sidebar';
import { useUser } from '../../store/auth.store';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const user = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SearchProvider>
      <DashboardProvider>
        <ArchivedProvider>
          <div className="flex h-screen overflow-hidden bg-custom-background">
            <Sidebar className="hidden lg:flex" />

            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetContent side="left" className="w-full max-w-74 p-0">
                <Sidebar className="flex h-full w-full border-r-0" />
              </SheetContent>
            </Sheet>

            <div className="flex flex-1 flex-col overflow-hidden">
              <DashboardNav
                user={user}
                onMenuClick={() => setIsSidebarOpen(true)}
                onAddBookmark={() => setIsModalOpen(true)}
              />
              <main className="flex-1 overflow-y-auto pt-6 px-4 sm:pt-8 sm:px-8 pb-16">
                <Outlet />
              </main>
            </div>

            <AddBookmarkModal open={isModalOpen} onOpenChange={setIsModalOpen} />
          </div>
        </ArchivedProvider>
      </DashboardProvider>
    </SearchProvider>
  );
}
