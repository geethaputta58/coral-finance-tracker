
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, ExternalLinkIcon, ClockIcon, NewspaperIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// In a real app, we'd fetch from real RSS feeds
// For this demo, we'll use mock news data

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  publishDate: string;
  image?: string;
}

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(6);
  
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch with a delay
    const fetchNews = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be a fetch call to an API that processes RSS feeds
        // For the demo, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        setNewsItems(mockNewsItems);
        setFilteredItems(mockNewsItems);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast({
          title: 'Error',
          description: 'Failed to load news items. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, [toast]);
  
  useEffect(() => {
    // Filter news items based on search term
    if (searchTerm.trim() === '') {
      setFilteredItems(newsItems);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = newsItems.filter(
        item => 
          item.title.toLowerCase().includes(lowerCaseSearch) || 
          item.description.toLowerCase().includes(lowerCaseSearch) ||
          item.source.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, newsItems]);
  
  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 6);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial News</h1>
        <p className="text-muted-foreground">
          Stay up-to-date with the latest financial news from trusted sources.
        </p>
      </div>
      
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search news articles..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="pb-2 animate-pulse">
                <div className="h-6 bg-muted rounded-md w-4/5 mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-3/5"></div>
              </CardHeader>
              <CardContent className="flex-grow animate-pulse">
                <div className="h-20 bg-muted rounded-md"></div>
              </CardContent>
              <CardFooter className="animate-pulse">
                <div className="h-8 bg-muted rounded-md w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <NewspaperIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No news articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search term or check back later for new articles.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.slice(0, visibleItems).map((item) => (
              <Card key={item.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium rounded">
                      {item.source}
                    </span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {formatDate(item.publishDate)}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="line-clamp-3">
                    {item.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full text-primary">
                      Read More <ExternalLinkIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {visibleItems < filteredItems.length && (
            <div className="flex justify-center mt-8">
              <Button onClick={handleLoadMore}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Mock news data (would be fetched from RSS feeds in a real app)
const mockNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Global Markets Rally as Inflation Fears Ease',
    description: 'Global stock markets surged on Wednesday as new data showed inflation cooling faster than expected, potentially opening the door for central banks to ease their monetary tightening policies.',
    link: 'https://example.com/news/1',
    source: 'Economic Times',
    publishDate: '2023-04-15T09:30:00Z',
  },
  {
    id: '2',
    title: 'Tech Sector Faces New Regulatory Challenges',
    description: 'Major technology companies are preparing for a wave of new regulations as governments worldwide seek to address concerns about data privacy, market competition, and artificial intelligence.',
    link: 'https://example.com/news/2',
    source: 'BBC Business',
    publishDate: '2023-04-14T14:15:00Z',
  },
  {
    id: '3',
    title: 'Oil Prices Drop on Higher Inventory Reports',
    description: 'Crude oil prices fell by over 3% following reports of unexpectedly high U.S. inventory levels, casting doubt on the strength of global demand recovery.',
    link: 'https://example.com/news/3',
    source: 'India Today',
    publishDate: '2023-04-14T08:45:00Z',
  },
  {
    id: '4',
    title: 'Central Bank Signals Pause in Interest Rate Hikes',
    description: 'The Federal Reserve indicated it may pause its aggressive interest rate hiking campaign as officials see signs that inflation is beginning to moderate while acknowledging risks to economic growth.',
    link: 'https://example.com/news/4',
    source: 'Economic Times',
    publishDate: '2023-04-13T16:20:00Z',
  },
  {
    id: '5',
    title: 'Housing Market Shows Signs of Cooling',
    description: 'After two years of record growth, the housing market is showing clear signs of slowing down as mortgage rates rise and affordability concerns mount among potential buyers.',
    link: 'https://example.com/news/5',
    source: 'BBC Business',
    publishDate: '2023-04-13T11:30:00Z',
  },
  {
    id: '6',
    title: 'Retail Sales Exceed Expectations Despite Inflation',
    description: 'Consumer spending remained resilient in March, with retail sales increasing by 0.7% despite ongoing inflation concerns, suggesting continued economic strength.',
    link: 'https://example.com/news/6',
    source: 'India Today',
    publishDate: '2023-04-12T15:10:00Z',
  },
  {
    id: '7',
    title: 'Cryptocurrency Market Stabilizes After Recent Volatility',
    description: 'The cryptocurrency market has shown signs of stabilization following weeks of high volatility, with Bitcoin holding above key support levels and institutional interest continuing to grow.',
    link: 'https://example.com/news/7',
    source: 'Economic Times',
    publishDate: '2023-04-12T10:45:00Z',
  },
  {
    id: '8',
    title: 'Supply Chain Issues Continue to Impact Manufacturing',
    description: 'Global manufacturing output remains constrained as companies continue to face supply chain disruptions, component shortages, and rising logistics costs.',
    link: 'https://example.com/news/8',
    source: 'BBC Business',
    publishDate: '2023-04-11T13:25:00Z',
  },
  {
    id: '9',
    title: 'New Tax Incentives Announced for Green Energy Investments',
    description: 'The government unveiled a package of tax incentives and subsidies aimed at accelerating investments in renewable energy projects and sustainable infrastructure.',
    link: 'https://example.com/news/9',
    source: 'India Today',
    publishDate: '2023-04-11T09:00:00Z',
  },
  {
    id: '10',
    title: 'Employment Growth Slows as Labor Market Tightens',
    description: 'Job creation slowed last month as companies struggle to find qualified workers in an increasingly tight labor market, potentially signaling a shift in employment trends.',
    link: 'https://example.com/news/10',
    source: 'Economic Times',
    publishDate: '2023-04-10T16:40:00Z',
  },
  {
    id: '11',
    title: 'Major Merger in Financial Services Sector Announced',
    description: 'Two leading financial institutions announced a merger agreement valued at $25 billion, creating one of the largest banking entities in the region and reshaping the competitive landscape.',
    link: 'https://example.com/news/11',
    source: 'BBC Business',
    publishDate: '2023-04-10T11:15:00Z',
  },
  {
    id: '12',
    title: 'Consumer Confidence Index Reaches Post-Pandemic High',
    description: 'The latest consumer confidence survey showed sentiment improving to its highest level since before the pandemic, driven by a strong job market and easing inflation concerns.',
    link: 'https://example.com/news/12',
    source: 'India Today',
    publishDate: '2023-04-09T14:50:00Z',
  },
];

export default NewsPage;
