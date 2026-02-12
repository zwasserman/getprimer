import ChatModal from "@/components/ChatModal";

const ChatPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ChatModal open={true} onClose={() => {}} isEmbedded={true} />
    </div>
  );
};

export default ChatPage;
