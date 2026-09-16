// ============================================================================
// Discovery Layout
// Wrapper layout for public landing and exploration views, using the unified
// light background canvas (#F7F9FA) for a seamless Wanderlog experience.
// ============================================================================

interface DiscoveryLayoutProps {
  children: React.ReactNode;
}

const DiscoveryLayout: React.FC<DiscoveryLayoutProps> = ({ children }) => {
  return (
    <div className="flex-1 bg-[#F7F9FA]">
      <main className="h-full">
        {children}
      </main>
    </div>
  );
};

export default DiscoveryLayout;

