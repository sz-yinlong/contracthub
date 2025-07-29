import { CombinedContractSection } from './components/CombinedContractSection';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  Plus, 
  User, 
  Clock, 
  Building, 
  UserPlus, 
  ChevronDown, 
  ChevronUp, 
  ChevronsDown, 
  ChevronsUp, 
  ChevronsLeftRight, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight 
} from 'lucide-react';
import { useState } from 'react';
import { ContractDetails } from './components/ContractDetails';

// Унифицированный интерфейс для всех контрактов
interface Contract {
  id: number;
  title: string;
  description: string;
  category: string;
  stage: 'supplier_search' | 'price_negotiation' | 'sample_approval' | 'logistics' | 'customs' | 'delivery';
  status?: 'active' | 'pending';
  timeRemaining: string;
  customer: {
    name: string;
    isNew: boolean;
    completedContracts?: number;
  };
  assignedFrom?: {
    name: string;
    department: string;
  };
  assignedTo?: {
    name: string;
    department: string;
  };
  isAddressed?: boolean;
}

// Компонент для секции "В работе"
const WorkContractSection = ({ contracts, globalCollapsed, onContractClick }: { 
  contracts: Contract[]; 
  globalCollapsed: boolean; 
  onContractClick: (contract: Contract) => void 
}) => {
  const stageLabels = {
    supplier_search: 'Поиск поставщика',
    price_negotiation: 'Переговоры по цене',
    sample_approval: 'Утверждение образцов',
    logistics: 'Организация логистики',
    customs: 'Таможенное оформление',
    delivery: 'Доставка'
  };

  return (
    <div className="p-2 md:p-4 h-full">
      <div className="mb-4">
        <div className="text-center mb-4 text-muted-foreground flex items-center justify-center gap-2 py-2 bg-muted/30 rounded-lg">
          <span>Контракты в работе</span>
          <Badge variant="secondary" className="text-xs h-5 min-w-5 px-1 rounded-full">
            {contracts.length}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {contracts.map((contract) => (
            <WorkContractCard 
              key={contract.id} 
              contract={contract} 
              stageLabels={stageLabels} 
              globalCollapsed={globalCollapsed} 
              onContractClick={onContractClick} 
            />
          ))}
          
          {contracts.length === 0 && (
            <div className="text-center text-muted-foreground text-xs py-4">
              Нет контрактов в работе
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Отдельный компонент для карточки контракта в работе
const WorkContractCard = ({ 
  contract, 
  stageLabels,
  globalCollapsed,
  onContractClick
}: { 
  contract: Contract; 
  stageLabels: Record<string, string>; 
  globalCollapsed: boolean;
  onContractClick: (contract: Contract) => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const effectiveCollapsed = globalCollapsed || isCollapsed;

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const handleCompleteAndSend = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Завершить и отправить контракт ${contract.id}`);
  };

  const renderContractTitle = (title: string) => {
    const parts = title.split(' ');
    if (parts.length >= 2 && parts[0] === 'Контракт') {
      const contractLabel = parts[0];
      const contractNumber = parts.slice(1).join(' ');
      
      return (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{contractLabel}</span>
          <span className="font-bold text-foreground">{contractNumber}</span>
        </div>
      );
    }
    return <span className="font-medium">{title}</span>;
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow flex flex-col relative" onClick={() => onContractClick(contract)}>
      <div className="bg-muted/20 border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="text-sm truncate flex items-center gap-2">
          {renderContractTitle(contract.title)}
          <Badge variant="secondary" className="text-xs">
            {contract.category}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-muted/50 shrink-0 border border-gray-300 rounded"
          onClick={toggleCollapse}
          title={effectiveCollapsed ? "Развернуть" : "Свернуть"}
        >
          {effectiveCollapsed ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className={`px-3 md:px-4 flex gap-2 md:gap-3 min-h-0 ${effectiveCollapsed ? 'pb-2' : 'pb-4 pt-1'}`}>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className={effectiveCollapsed ? 'mb-1' : 'mb-2'}>
            <p className="text-xs md:text-sm text-foreground overflow-hidden text-ellipsis" 
               style={{ 
                 display: '-webkit-box', 
                 WebkitLineClamp: 2, 
                 WebkitBoxOrient: 'vertical' 
               }}>
              {contract.description}
            </p>
          </div>
          
          {!effectiveCollapsed && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Этап:</span>
                <span className="text-xs">{stageLabels[contract.stage]}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Заказчик:</span>
                <div className="flex items-center gap-2 px-2 py-1 border border-border/30 rounded">
                  <span className="text-xs">{contract.customer.name}</span>
                  {contract.customer.isNew ? (
                    <UserPlus className="h-3 w-3 text-green-500" title="Новый клиент - первый контракт" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-muted-foreground">
                        {contract.customer.completedContracts} контр.
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-border pt-3 mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <span className="mr-2">время исполнения - осталось</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{contract.timeRemaining}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-10 text-xs hover:bg-blue-50 hover:border-blue-300 px-1 border-2 border-gray-300 rounded-md"
                      onClick={handleCompleteAndSend}
                      title="Завершить и отправить"
                    >
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default function App() {
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [sidesCollapsed, setSidesCollapsed] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Данные для входящих контрактов
  const incomingFreeContracts: Contract[] = [
    {
      id: 1,
      title: "Контракт №CN-001",
      description: "Смартфоны и планшеты из Шэньчжэня",
      category: "Электроника",
      stage: 'supplier_search',
      timeRemaining: "15 дней",
      customer: { name: "ТехноСфера ООО", isNew: true },
      assignedFrom: { name: "Алексей", department: "Продажи" },
      isAddressed: false
    },
    {
      id: 2,
      title: "Контракт №CN-002", 
      description: "Футболки и джинсы из Гуанчжоу",
      category: "Текстиль",
      stage: 'price_negotiation',
      timeRemaining: "9 дней",
      customer: { name: "Модный Стиль", isNew: false, completedContracts: 12 },
      assignedFrom: { name: "Дмитрий", department: "Продажи" },
      isAddressed: false
    }
  ];

  const incomingAddressedContracts: Contract[] = [
    {
      id: 3,
      title: "Контракт №CN-003",
      description: "Беговые дорожки и гантели",
      category: "Спортивные товары",
      stage: 'sample_approval',
      timeRemaining: "12 дней",
      customer: { name: "СпортЛайф", isNew: false, completedContracts: 7 },
      assignedFrom: { name: "Алексей", department: "Продажи" },
      assignedTo: { name: "Иван", department: "Менеджер" },
      isAddressed: true
    },
    {
      id: 4,
      title: "Контракт №CN-004",
      description: "Пылесосы и мультиварки",
      category: "Бытовая техника",
      stage: 'logistics',
      timeRemaining: "7 дней",
      customer: { name: "ДомТехника", isNew: true },
      assignedFrom: { name: "Дмитрий", department: "Продажи" },
      assignedTo: { name: "Иван", department: "Менеджер" },
      isAddressed: true
    }
  ];

  const workContracts: Contract[] = [
    {
      id: 5,
      title: "Контракт №CN-005",
      description: "Кремы, шампуни и маски из Гуанчжоу",
      category: "Косметика",
      stage: 'customs',
      status: 'active',
      timeRemaining: "5 дней",
      customer: { name: "КрасотаПлюс", isNew: false, completedContracts: 23 },
      assignedFrom: { name: "Елена", department: "Закупки" },
      assignedTo: { name: "Ольга", department: "Таможня" }
    },
    {
      id: 6,
      title: "Контракт №CN-006",
      description: "Конструкторы и куклы",
      category: "Детские товары",
      stage: 'delivery',
      status: 'pending',
      timeRemaining: "2 дня",
      customer: { name: "ДетскийМир+", isNew: true },
      assignedFrom: { name: "Сергей", department: "Логистика" },
      assignedTo: { name: "Павел", department: "Склад" }
    },
    {
      id: 10,
      title: "Контракт №CN-010",
      description: "Светодиодные лампы и выключатели",
      category: "Электрооборудование",
      stage: 'price_negotiation',  
      status: 'active',
      timeRemaining: "8 дней",
      customer: { name: "ЭлектроТорг", isNew: false, completedContracts: 18 },
      assignedFrom: { name: "Алексей", department: "Продажи" },
      assignedTo: { name: "Иван", department: "Менеджер" }
    }
  ];

  const outgoingFreeContracts: Contract[] = [
    {
      id: 7,
      title: "Контракт №CN-007",
      description: "Столы, стулья и полки из Фошань",
      category: "Мебель",
      stage: 'delivery',
      timeRemaining: "4 дня",
      customer: { name: "ОфисМебель", isNew: false, completedContracts: 15 },
      assignedFrom: { name: "Максим", department: "Склад" },
      isAddressed: false
    }
  ];

  const outgoingAddressedContracts: Contract[] = [
    {
      id: 8,
      title: "Контракт №CN-008",
      description: "Фильтры, свечи и тормозные колодки",
      category: "Автозапчасти",
      stage: 'delivery',
      timeRemaining: "1 день",
      customer: { name: "АвтоЗапчасти РУС", isNew: false, completedContracts: 34 },
      assignedFrom: { name: "Николай", department: "Склад" },
      assignedTo: { name: "Татьяна", department: "Доставка" },
      isAddressed: true
    },
    {
      id: 9,
      title: "Контракт №CN-009",
      description: "Дрели, отвертки и ключи из Тайчжоу",
      category: "Инструменты",
      stage: 'delivery',
      timeRemaining: "3 дня",
      customer: { name: "СтройИнструмент", isNew: true },
      assignedFrom: { name: "Максим", department: "Склад" },
      assignedTo: { name: "Виктория", department: "Курьерская служба" },
      isAddressed: true
    }
  ];

  const handleToggleAll = () => {
    setAllCollapsed(!allCollapsed);
  };

  const handleContractClick = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleCloseContract = () => {
    setSelectedContract(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-4 md:px-8 py-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <h1 className="text-base md:text-xl font-medium truncate">
              <span className="hidden sm:inline">Система управления контрактами LibriumWay</span>
              <span className="sm:hidden">LibriumWay</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Новый контракт</span>
              <span className="sm:hidden">Новый</span>
            </Button>
            
            <div className="flex items-center gap-1 md:gap-2">
              <Avatar className="h-6 w-6 md:h-8 md:w-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-xs md:text-sm hidden sm:block">
                <div className="font-medium">Иван</div>
                <div className="text-muted-foreground text-xs">Менеджер</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 md:px-8 py-4 md:py-6">
        <div className="w-full">
          <div className="border border-border bg-card">
            <div className="p-2 md:p-4 text-center border-b border-border flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4">
              <h2 className="text-base md:text-lg font-medium">Контракты</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAll}
                className="flex items-center gap-1 text-xs px-2 py-1 border-2 border-gray-300 rounded"
                title={allCollapsed ? "Развернуть все" : "Свернуть все"}
              >
                {allCollapsed ? (
                  <>
                    <ChevronsDown className="h-3 w-3" />
                    <span className="hidden sm:inline">Развернуть все</span>
                    <span className="sm:hidden">Развернуть</span>
                  </>
                ) : (
                  <>
                    <ChevronsUp className="h-3 w-3" />
                    <span className="hidden sm:inline">Свернуть все</span>
                    <span className="sm:hidden">Свернуть</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="md:hidden">
              <Tabs defaultValue="incoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="incoming" className="text-xs">
                    Входящие ({incomingFreeContracts.length + incomingAddressedContracts.length})
                  </TabsTrigger>
                  <TabsTrigger value="work" className="text-xs">
                    В работе ({workContracts.length})
                  </TabsTrigger>
                  <TabsTrigger value="outgoing" className="text-xs">
                    Исходящие ({outgoingFreeContracts.length + outgoingAddressedContracts.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="incoming" className="mt-0">
                  <div className="min-h-[500px]">
                    <CombinedContractSection 
                      freeContracts={incomingFreeContracts}
                      addressedContracts={incomingAddressedContracts}
                      globalCollapsed={allCollapsed}
                      onContractClick={handleContractClick}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="work" className="mt-0">
                  <div className="min-h-[500px]">
                    <WorkContractSection 
                      contracts={workContracts} 
                      globalCollapsed={allCollapsed} 
                      onContractClick={handleContractClick} 
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="outgoing" className="mt-0">
                  <div className="min-h-[500px]">
                    <CombinedContractSection 
                      freeContracts={outgoingFreeContracts}
                      addressedContracts={outgoingAddressedContracts}
                      isOutgoing={true}
                      globalCollapsed={allCollapsed}
                      onContractClick={handleContractClick}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="hidden md:block">
              <div className="grid border-b border-border" style={{ 
                gridTemplateColumns: sidesCollapsed ? 'auto 1fr auto' : '1fr 2fr 1fr'
              }}>
                <div className={`border-r border-border flex items-center justify-center ${sidesCollapsed ? 'p-2' : 'p-4'}`}>
                  {sidesCollapsed ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-xs text-muted-foreground flex flex-col items-center gap-1" style={{ 
                        writingMode: 'vertical-rl', 
                        textOrientation: 'mixed' 
                      }}>
                        <span>Входящие</span>
                        <Badge variant="secondary" className="text-xs h-4 min-w-4 px-1">
                          {incomingFreeContracts.length + incomingAddressedContracts.length}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3>Пул входящих</h3>
                    </div>
                  )}
                </div>
                
                <div className="p-4 text-center border-r border-border">
                  <div className="flex items-center justify-center gap-2">
                    <h3>В работе</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSidesCollapsed(!sidesCollapsed)}
                      className="h-6 w-6 p-0 border-2 border-gray-300 rounded"
                      title={sidesCollapsed ? "Развернуть пулы" : "Свернуть пулы"}
                    >
                      {sidesCollapsed ? (
                        <div className="flex items-center">
                          <ChevronRight className="h-2.5 w-2.5" />
                          <ChevronLeft className="h-2.5 w-2.5 -ml-1" />
                        </div>
                      ) : (
                        <ChevronsLeftRight className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className={`flex items-center justify-center ${sidesCollapsed ? 'p-2' : 'p-4'}`}>
                  {sidesCollapsed ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-xs text-muted-foreground flex flex-col items-center gap-1" style={{ 
                        writingMode: 'vertical-rl', 
                        textOrientation: 'mixed' 
                      }}>
                        <span>Исходящие</span>
                        <Badge variant="secondary" className="text-xs h-4 min-w-4 px-1">
                          {outgoingFreeContracts.length + outgoingAddressedContracts.length}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3>Пул исходящих</h3>
                    </div>
                  )}
                </div>
              </div>
              
              {sidesCollapsed ? (
                <div className="min-h-[700px] flex justify-center">
                  <div className="w-full max-w-4xl">
                    <WorkContractSection 
                      contracts={workContracts} 
                      globalCollapsed={allCollapsed} 
                      onContractClick={handleContractClick} 
                    />
                  </div>
                </div>
              ) : (
                <div className="grid min-h-[700px]" style={{ 
                  gridTemplateColumns: '1fr 2fr 1fr'
                }}>
                  <div className="border-r border-border">
                    <CombinedContractSection 
                      freeContracts={incomingFreeContracts}
                      addressedContracts={incomingAddressedContracts}
                      globalCollapsed={allCollapsed}
                      onContractClick={handleContractClick}
                    />
                  </div>
                  
                  <div className="border-r border-border">
                    <WorkContractSection 
                      contracts={workContracts} 
                      globalCollapsed={allCollapsed} 
                      onContractClick={handleContractClick} 
                    />
                  </div>
                  
                  <div>
                    <CombinedContractSection 
                      freeContracts={outgoingFreeContracts}
                      addressedContracts={outgoingAddressedContracts}
                      isOutgoing={true}
                      globalCollapsed={allCollapsed}
                      onContractClick={handleContractClick}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {selectedContract && (
        <ContractDetails 
          contract={selectedContract}
          onClose={handleCloseContract}
        />
      )}
    </div>
  );
}