import { redirect } from 'next/navigation'

useEffect(() => {
  fetch("https://your-render-url.onrender.com/health");
}, []);

export default function Home() {
  redirect('/about')
}