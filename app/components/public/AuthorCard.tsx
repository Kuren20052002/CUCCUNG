import Image from 'next/image';

interface Author {
  id?: string;
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
}

export function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
      <div className="w-24 h-24 rounded-[1.25rem] overflow-hidden border-4 border-white shadow-md">
        <Image src={author.avatar || 'https://i.pravatar.cc/200'} alt={author.name || 'Tác giả'} width={96} height={96} className="object-cover w-full h-full" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-black text-slate-900">{author.name}</h3>
        <p className="text-sm text-slate-600 mt-2">{author.bio || 'Chuyên gia tư vấn chăm sóc mẹ & bé, mang lại thông tin đáng tin cậy cho gia đình bạn.'}</p>
      </div>
    </div>
  );
}

export default AuthorCard;
