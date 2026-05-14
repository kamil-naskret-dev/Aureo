import { createFileRoute } from '@tanstack/react-router';
import { Sheet, SheetContent } from '@aureo/ui';
import { useState } from 'react';

import { useUser } from '../../store/auth.store';
import { DashboardProvider } from '../../features/bookmarks/context/DashboardContext';
import { AddBookmarkModal } from '../../features/bookmarks/components/AddBookmarkModal';
import { BookmarksList } from '../../features/bookmarks/components/BookmarksList';
import { DashboardNav } from '../../features/bookmarks/components/DashboardNav';
import { Sidebar } from '../../features/bookmarks/components/Sidebar';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

export type SortOption = 'newest' | 'oldest' | 'title';

function DashboardPage() {
  const user = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardProvider>
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
          <main className="flex-1 overflow-y-auto p-6">
            <BookmarksList />
          </main>
        </div>

        <AddBookmarkModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </DashboardProvider>
  );
}
