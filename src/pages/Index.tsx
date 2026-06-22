import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const HERO_IMG = 'https://cdn.poehali.dev/projects/e1872486-b796-4685-9d83-cc9ae81adc57/files/e559307e-43cc-4aac-9b6d-4bd7d35ee19d.jpg';

const chartBars = [
  { label: 'Янв', value: 38 },
  { label: 'Фев', value: 52 },
  { label: 'Мар', value: 61 },
  { label: 'Апр', value: 47 },
  { label: 'Май', value: 75 },
  { label: 'Июн', value: 88 },
  { label: 'Июл', value: 95 },
];

const AnimatedChart = () => {
  const [progress, setProgress] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1800;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      setLineProgress(eased);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 400);
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const maxVal = Math.max(...chartBars.map(b => b.value));
  const w = 280;
  const h = 90;
  const pts = chartBars.map((b, i) => {
    const x = (i / (chartBars.length - 1)) * w;
    const y = h - (b.value / maxVal) * h;
    return `${x},${y}`;
  });
  const lineD = `M ${pts.join(' L ')}`;

  return (
    <div className="absolute bottom-5 left-5 right-5 glass rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-foreground/80 font-display">Рост проектов</span>
        <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
          <Icon name="TrendingUp" size={13} /> +148% за год
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-16 mb-2">
        {chartBars.map((b, i) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md transition-none"
              style={{
                height: `${(b.value / maxVal) * 100 * progress}%`,
                background: i === chartBars.length - 1
                  ? 'linear-gradient(to top, hsl(14 90% 52%), hsl(38 96% 54%))'
                  : 'linear-gradient(to top, hsl(14 90% 52% / 0.45), hsl(38 96% 54% / 0.4))',
                maxHeight: '100%',
                minHeight: progress > 0 ? 2 : 0,
              }}
            />
          </div>
        ))}
      </div>
      <div className="relative h-[90px] -mx-1">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(14 90% 52%)" />
              <stop offset="100%" stopColor="hsl(38 96% 54%)" />
            </linearGradient>
            <clipPath id="lineClip">
              <rect x="0" y="-10" width={w * lineProgress} height={h + 20} />
            </clipPath>
          </defs>
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#lineClip)"
          />
          {chartBars.map((b, i) => {
            const x = (i / (chartBars.length - 1)) * w;
            const y = h - (b.value / maxVal) * h;
            const visible = lineProgress > i / (chartBars.length - 1);
            return visible ? (
              <circle key={i} cx={x} cy={y} r="4" fill="hsl(14 90% 52%)" stroke="white" strokeWidth="2" />
            ) : null;
          })}
        </svg>
      </div>
      <div className="flex justify-between mt-1">
        {chartBars.map(b => (
          <span key={b.label} className="text-[10px] text-muted-foreground flex-1 text-center">{b.label}</span>
        ))}
      </div>
    </div>
  );
};

const navLinks = [
  { label: 'Главная', href: '#hero' },
  { label: 'О Центре', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Блог', href: '#blog' },
  { label: 'Контакты', href: '#contacts' },
];

const stats = [
  { value: '350+', label: 'проектов запущено' },
  { value: '7 лет', label: 'на рынке' },
  { value: '×4', label: 'средний рост выручки' },
  { value: '98%', label: 'остаются с нами' },
];

const services = [
  { icon: 'Rocket', title: 'Запуск проектов', desc: 'Разработка сайтов, приложений и платформ под ключ — от идеи до первого клиента.' },
  { icon: 'TrendingUp', title: 'Продвижение', desc: 'SEO, контекст, таргет и контент-маркетинг с прозрачной аналитикой результата.' },
  { icon: 'LifeBuoy', title: 'Техподдержка 24/7', desc: 'Сопровождение, обновления и мониторинг, чтобы проект работал без сбоев.' },
  { icon: 'Megaphone', title: 'Бренд и контент', desc: 'Айдентика, упаковка соцсетей и креативы, которые выделяют вас на рынке.' },
  { icon: 'BarChart3', title: 'Аналитика и рост', desc: 'Сквозная аналитика, A/B-тесты и стратегия масштабирования бизнеса.' },
  { icon: 'ShieldCheck', title: 'Аудит проекта', desc: 'Глубокий разбор слабых мест и точек роста с понятным планом действий.' },
];

const portfolio = [
  { tag: 'E-commerce', title: 'MarketPro', result: 'Рост заказов на 280% за полгода', color: 'from-fuchsia-500 to-purple-600' },
  { tag: 'EdTech', title: 'SkillWave', result: '12 000 учеников за первый квартал', color: 'from-cyan-400 to-blue-600' },
  { tag: 'SaaS', title: 'FlowDesk', result: 'Снижение оттока клиентов на 40%', color: 'from-pink-500 to-rose-600' },
  { tag: 'Услуги', title: 'CleanCity', result: 'ТОП-3 в поиске по 50 запросам', color: 'from-violet-500 to-indigo-600' },
];

const posts = [
  { date: '18 июня', cat: 'Маркетинг', title: 'Как собрать воронку, которая продаёт сама' },
  { date: '11 июня', cat: 'Разработка', title: '5 признаков, что сайту пора на редизайн' },
  { date: '03 июня', cat: 'Аналитика', title: 'Считаем ROI рекламы без боли и таблиц' },
];

const Index = () => {
  const [form, setForm] = useState({ name: '', contact: '', type: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка отправлена!',
      description: 'Мы свяжемся с вами в ближайшее время и проведём анализ проекта.',
    });
    setForm({ name: '', contact: '', type: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-primary/25 blur-[120px] animate-blob" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-accent/20 blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-0 left-1/3 w-[28rem] h-[28rem] rounded-full bg-amber-400/15 blur-[120px] animate-blob" style={{ animationDelay: '8s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="container flex items-center justify-between h-20">
          <a href="#hero" className="flex items-center gap-2.5 font-display font-bold text-lg">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent glow">
              <Icon name="Hexagon" size={20} className="text-white" />
            </span>
            Единый<span className="text-gradient">Центр</span>
          </a>
          <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
            ))}
          </nav>
          <Button asChild className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 font-semibold">
            <a href="#contacts">Оставить заявку</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Принимаем новые проекты
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6">
              Поддержка и <span className="text-gradient">продвижение</span> онлайн проектов
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              Единый центр, где ваш проект запускают, развивают и сопровождают команды экспертов. От первой идеи до стабильного роста.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 font-semibold text-base h-12 px-7">
                <a href="#contacts">Анализ проекта бесплатно</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-transparent hover:bg-secondary text-base h-12 px-7">
                <a href="#services">Наши услуги</a>
              </Button>
            </div>
          </div>
          <div className="relative reveal" style={{ animationDelay: '0.15s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl rounded-full" />
            <div className="relative rounded-[2rem] overflow-hidden animate-float glow">
              <img src={HERO_IMG} alt="Команда онлайн проектов" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-[2rem]" />
              <AnimatedChart />
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold">Онлайн 24/7</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mt-16 lg:mt-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className="glass rounded-2xl p-6 text-center reveal" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                <div className="font-display text-3xl lg:text-4xl font-extrabold text-gradient mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24">
        <div className="container grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">О Центре</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">Одна команда — весь цикл вашего проекта</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Мы объединили разработчиков, маркетологов, дизайнеров и аналитиков под одной крышей. Вам больше не нужно собирать подрядчиков по кусочкам — всё сопровождение в одном месте.
            </p>
            <ul className="space-y-4">
              {['Персональный менеджер на связи', 'Прозрачные отчёты и метрики', 'Фиксированные сроки и гарантии'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-primary/20 text-primary shrink-0">
                    <Icon name="Check" size={16} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'Users', t: 'Команда 40+', d: 'специалистов' },
              { icon: 'Clock', t: 'От 5 дней', d: 'до запуска' },
              { icon: 'Globe', t: 'Работаем', d: 'по всему миру' },
              { icon: 'Award', t: 'Сертифицированы', d: 'Яндекс и VK' },
            ].map((c) => (
              <div key={c.t} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                <Icon name={c.icon} size={26} className="text-accent mb-4" />
                <div className="font-display font-bold text-lg">{c.t}</div>
                <div className="text-muted-foreground text-sm">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">Услуги</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold">Всё, что нужно вашему проекту</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.title} className="group glass rounded-2xl p-7 hover:bg-white/[0.07] hover:-translate-y-1.5 transition-all duration-300">
                <span className="grid place-items-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent mb-5 group-hover:scale-110 transition-transform">
                  <Icon name={s.icon} size={26} className="text-white" />
                </span>
                <h3 className="font-display font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">Портфолио</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold">Проекты, которые мы вырастили</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {portfolio.map((p) => (
              <div key={p.title} className="group relative overflow-hidden rounded-3xl glass p-8 min-h-[220px] flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300">
                <div className={`absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gradient-to-br ${p.color} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity`} />
                <span className="relative inline-flex w-fit text-xs font-semibold px-3 py-1 rounded-full glass">{p.tag}</span>
                <div className="relative">
                  <h3 className="font-display font-bold text-2xl mb-2">{p.title}</h3>
                  <p className="text-muted-foreground">{p.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-24">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">Блог</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold">Делимся опытом и инсайтами</h2>
            </div>
            <Button variant="outline" className="rounded-full bg-transparent border-border hover:bg-secondary">Все статьи</Button>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {posts.map((p) => (
              <article key={p.title} className="group glass rounded-2xl p-7 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/15 text-primary font-medium">{p.cat}</span>
                  <span>{p.date}</span>
                </div>
                <h3 className="font-display font-bold text-xl leading-snug mb-5">{p.title}</h3>
                <span className="inline-flex items-center gap-2 text-accent font-medium">
                  Читать <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts / Form */}
      <section id="contacts" className="py-24">
        <div className="container">
          <div className="relative overflow-hidden glass rounded-[2.5rem] p-8 sm:p-12 lg:p-16 grid lg:grid-cols-2 gap-12">
            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-4">Контакты</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-5">Заявка на консультацию и анализ проекта</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Расскажите о проекте — проведём бесплатный аудит, найдём точки роста и предложим план развития.
              </p>
              <div className="space-y-4">
                {[
                  { icon: 'Mail', t: 'hello@edincentr.ru' },
                  { icon: 'Phone', t: '+7 (495) 000-00-00' },
                  { icon: 'MapPin', t: 'Москва, ул. Цифровая, 1' },
                ].map((c) => (
                  <div key={c.t} className="flex items-center gap-3 text-muted-foreground">
                    <span className="grid place-items-center w-10 h-10 rounded-xl glass text-accent shrink-0">
                      <Icon name={c.icon} size={18} />
                    </span>
                    {c.t}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-4">
              <Input
                required
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-12 rounded-xl bg-secondary/60 border-border"
              />
              <Input
                required
                placeholder="Телефон или email"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="h-12 rounded-xl bg-secondary/60 border-border"
              />
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="h-12 rounded-xl bg-secondary/60 border-border">
                  <SelectValue placeholder="Что вас интересует?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="launch">Запуск проекта</SelectItem>
                  <SelectItem value="promo">Продвижение</SelectItem>
                  <SelectItem value="support">Техподдержка</SelectItem>
                  <SelectItem value="audit">Аудит и анализ</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Коротко о вашем проекте"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="min-h-28 rounded-xl bg-secondary/60 border-border resize-none"
              />
              <Button type="submit" size="lg" className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 font-semibold text-base">
                Отправить заявку
              </Button>
              <p className="text-xs text-muted-foreground text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2.5 font-display font-bold text-foreground">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Icon name="Hexagon" size={16} className="text-white" />
            </span>
            ЕдиныйЦентр
          </div>
          <p>© 2026 Единый Центр Поддержки и Продвижения Онлайн Проектов</p>
          <div className="flex gap-3">
            {['Send', 'Instagram', 'Youtube'].map((s) => (
              <a key={s} href="#" className="grid place-items-center w-9 h-9 rounded-lg glass hover:text-foreground transition-colors">
                <Icon name={s} size={16} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;