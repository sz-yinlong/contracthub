import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { X, Send, FileText, MessageCircle, History, Clock, User, Building, UserPlus, CheckCircle, FolderOpen, Download, Upload } from 'lucide-react';
import { useState } from 'react';

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

interface ContractDetailsProps {
  contract: Contract;
  onClose: () => void;
}

export function ContractDetails({ contract, onClose }: ContractDetailsProps) {
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'history' | 'documents'>('comments');

  // Статусы контракта
  const getStatusInfo = (contract: Contract) => {
    // Базовая логика определения статуса на основе данных контракта
    if (contract.id <= 4) {
      return { status: 'ожидает', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    } else if (contract.id <= 7) {
      return { status: 'в работе', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    } else {
      return { status: 'готов к отправке', color: 'bg-green-100 text-green-800 border-green-300' };
    }
  };

  const statusInfo = getStatusInfo(contract);

  // Определяем, нужно ли показывать кнопки "принять"
  const isIncomingContract = contract.id <= 4;
  const isIncomingFreeContract = contract.id <= 2;
  const isIncomingAddressedContract = contract.id > 2 && contract.id <= 4;
  const isCurrentUserAssigned = contract.assignedTo?.name === "Иван";

  // Мокированные документы для демонстрации
  const documents = {
    incoming: [
      {
        id: 1,
        name: 'Заявка от клиента.pdf',
        size: '245 KB',
        date: '15.01.2024 10:15',
        type: 'application/pdf'
      },
      {
        id: 2,
        name: 'Техническое задание.docx',
        size: '156 KB',
        date: '15.01.2024 10:20',
        type: 'application/docx'
      },
      {
        id: 3,
        name: 'Прайс-лист поставщика.xlsx',
        size: '89 KB',
        date: '15.01.2024 14:30',
        type: 'application/xlsx'
      }
    ],
    outgoing: [
      {
        id: 4,
        name: 'Коммерческое предложение.pdf',
        size: '312 KB',
        date: '16.01.2024 09:15',
        type: 'application/pdf'
      },
      {
        id: 5,
        name: 'Договор поставки.docx',
        size: '198 KB',
        date: '16.01.2024 11:20',
        type: 'application/docx'
      }
    ]
  };

  // Мокированные комментарии для демонстрации
  const comments = [
    {
      id: 1,
      author: 'Алексей',
      department: 'Продажи',
      date: '15.01.2024 10:30',
      text: 'Получен запрос от клиента на поставку смартфонов и планшетов из Шэньчжэня'
    },
    {
      id: 2,
      author: 'Иван',
      department: 'Менеджер',
      date: '15.01.2024 14:20',
      text: 'Принят в работу. Начинаю поиск подходящих поставщиков'
    }
  ];

  // Мокированная история для демонстрации
  const history = [
    {
      id: 1,
      action: 'Создание контракта',
      user: 'Алексей',
      department: 'Продажи',
      date: '15.01.2024 10:15',
      details: 'Контракт создан на основе запроса клиента'
    },
    {
      id: 2,
      action: 'Передача в работу',
      user: 'Алексей',
      department: 'Продажи',
      date: '15.01.2024 10:20',
      details: 'Передан в пул входящих контрактов'
    },
    {
      id: 3,
      action: 'Взят в работу',
      user: 'Иван',
      department: 'Менеджер',
      date: '15.01.2024 14:18',
      details: 'Контракт принят в работу менеджером'
    }
  ];

  const handleSendComment = () => {
    if (newComment.trim()) {
      // Здесь будет логика отправки комментария
      console.log('Отправка комментария:', newComment);
      setNewComment('');
    }
  };

  const handleAcceptContract = () => {
    console.log('Принятие контракта:', contract.id);
  };

  const handleTakeContract = () => {
    console.log('Взятие контракта в работу:', contract.id);
  };

  const handleDownloadDocument = (doc: any) => {
    console.log('Скачивание документа:', doc.name);
  };

  const stageLabels = {
    supplier_search: 'Поиск поставщика',
    price_negotiation: 'Переговоры по цене',
    sample_approval: 'Утверждение образцов',
    logistics: 'Организация логистики',
    customs: 'Таможенное оформление',
    delivery: 'Доставка'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Шапка с заголовком и статусом */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{contract.title}</h2>
            <Badge 
              variant="outline" 
              className={`px-3 py-1 ${statusInfo.color} border`}
            >
              {statusInfo.status.toUpperCase()}
            </Badge>
            <Badge variant="secondary">{contract.category}</Badge>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Основное содержимое */}
        <div className="flex flex-1 min-h-0">
          {/* Левая часть - превью контракта */}
          <div className="flex-1 border-r">
            <div className="p-6 h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Превью контракта
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Основная информация */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Номер контракта</label>
                      <p className="text-sm">{contract.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Категория товара</label>
                      <p className="text-sm">{contract.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Описание товара</label>
                      <p className="text-sm">{contract.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Текущий этап</label>
                      <p className="text-sm">{stageLabels[contract.stage]}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Информация о заказчике */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Заказчик</label>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{contract.customer.name}</span>
                        {contract.customer.isNew ? (
                          <UserPlus className="h-4 w-4 text-green-500" title="Новый клиент" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-muted-foreground">
                              {contract.customer.completedContracts} контр.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Временные рамки */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Время исполнения</label>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>Осталось: {contract.timeRemaining}</span>
                    </div>
                  </div>

                  {/* Дополнительные поля для превью */}
                  <div className="space-y-3 mt-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Предполагаемая стоимость</label>
                      <Input placeholder="Не указана" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Примечания к заказу</label>
                      <Textarea placeholder="Дополнительные требования и условия..." className="mt-1" />
                    </div>
                  </div>

                  {/* Кнопки действий для входящих контрактов */}
                  {isIncomingContract && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex gap-2">
                        {/* Для свободных входящих контрактов - только принять */}
                        {isIncomingFreeContract && (
                          <Button 
                            onClick={handleTakeContract}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Принять в работу
                          </Button>
                        )}
                        
                        {/* Для адресных входящих контрактов - принять и отклонить */}
                        {isIncomingAddressedContract && isCurrentUserAssigned && (
                          <>
                            <Button 
                              onClick={handleAcceptContract}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Принять заявку
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => console.log('Отклонить контракт')}
                              className="flex items-center gap-2"
                            >
                              <X className="h-4 w-4" />
                              Отклонить
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Правая часть - комментарии и история */}
          <div className="w-96 flex flex-col">
            {/* Переключатель между комментариями, историей и документами */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'comments'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Комментарии</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'history'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">История</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'documents'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <FolderOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Документы</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Содержимое вкладок */}
            <div className="flex-1 flex flex-col min-h-0">
              {activeTab === 'comments' ? (
                <div className="flex flex-col h-full">
                  {/* Список комментариев */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="text-sm font-medium">{comment.author}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{comment.department}</span>
                            <span className="text-xs text-muted-foreground">{comment.date}</span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      
                      {comments.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                          Комментариев пока нет
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Поле для нового комментария */}
                  <div className="border-t p-4 space-y-3">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Добавьте комментарий..."
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={handleSendComment}
                      disabled={!newComment.trim()}
                      size="sm"
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Отправить комментарий
                    </Button>
                  </div>
                </div>
              ) : activeTab === 'history' ? (
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="border-l-2 border-muted pl-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.action}</span>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{item.user}</span>
                            <span>•</span>
                            <span>{item.department}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-6">
                    {/* Входящие документы */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Download className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium text-sm">Входящие документы</h4>
                        <Badge variant="secondary" className="text-xs">
                          {documents.incoming.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {documents.incoming.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{doc.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{doc.size}</span>
                                  <span>•</span>
                                  <span>{doc.date}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadDocument(doc)}
                              className="shrink-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Исходящие документы */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Upload className="h-4 w-4 text-orange-600" />
                        <h4 className="font-medium text-sm">Исходящие документы</h4>
                        <Badge variant="secondary" className="text-xs">
                          {documents.outgoing.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {documents.outgoing.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{doc.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{doc.size}</span>
                                  <span>•</span>
                                  <span>{doc.date}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadDocument(doc)}
                              className="shrink-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {(documents.incoming.length === 0 && documents.outgoing.length === 0) && (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        Документов пока нет
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}