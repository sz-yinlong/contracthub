import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  Clock, 
  Building, 
  UserPlus, 
  ChevronDown, 
  ChevronUp, 
  X, 
  CheckCircle, 
  User, 
  ArrowLeft,
  Hourglass
} from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';

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

interface ContractSectionProps {
  freeContracts: Contract[];
  addressedContracts: Contract[];
  isOutgoing?: boolean;
  globalCollapsed: boolean;
  onContractClick?: (contract: Contract) => void;
}

export function CombinedContractSection({ 
  freeContracts, 
  addressedContracts, 
  isOutgoing = false,
  globalCollapsed,
  onContractClick
}: ContractSectionProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedContractForReject, setSelectedContractForReject] = useState<Contract | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [takingContracts, setTakingContracts] = useState<Set<number>>(new Set());

  const stageLabels = {
    supplier_search: 'Поиск поставщика',
    price_negotiation: 'Переговоры по цене',
    sample_approval: 'Утверждение образцов',
    logistics: 'Организация логистики',
    customs: 'Таможенное оформление',
    delivery: 'Доставка'
  };

  const handleTakeContract = (e: React.MouseEvent, contractId: number) => {
    e.stopPropagation();
    setTakingContracts(prev => new Set([...prev, contractId]));
    setTimeout(() => {
      console.log(`Принят в работу контракт ${contractId}`);
      setTakingContracts(prev => {
        const newSet = new Set(prev);
        newSet.delete(contractId);
        return newSet;
      });
    }, 1500);
  };

  const handleAcceptContract = (e: React.MouseEvent, contractId: number) => {
    e.stopPropagation();
    console.log(`Принят контракт ${contractId}`);
  };

  const handleRejectContract = (e: React.MouseEvent, contract: Contract) => {
    e.stopPropagation();
    setSelectedContractForReject(contract);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (rejectReason.trim() && selectedContractForReject) {
      console.log(`Отклонен контракт ${selectedContractForReject.id} с причиной: ${rejectReason}`);
      setRejectDialogOpen(false);
      setRejectReason('');
      setSelectedContractForReject(null);
    }
  };

  const handleReturnToWork = (e: React.MouseEvent, contractId: number) => {
    e.stopPropagation();
    console.log(`Возвращен в работу контракт ${contractId}`);
  };

  const handleSendContract = (e: React.MouseEvent, contractId: number) => {
    e.stopPropagation();
    console.log(`Отправлен контракт ${contractId}`);
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

  const renderFreeContract = (contract: Contract) => (
    <ContractCard 
      key={contract.id}
      contract={contract}
      isAddressed={false}
      isOutgoing={isOutgoing}
      stageLabels={stageLabels}
      globalCollapsed={globalCollapsed}
      onTakeContract={handleTakeContract}
      onAcceptContract={handleAcceptContract}
      onRejectContract={handleRejectContract}
      onReturnToWork={handleReturnToWork}
      onSendContract={handleSendContract}
      takingContracts={takingContracts}
      renderContractTitle={renderContractTitle}
      onContractClick={onContractClick}
    />
  );

  const renderAddressedContract = (contract: Contract) => (
    <ContractCard 
      key={contract.id}
      contract={contract}
      isAddressed={true}
      isOutgoing={isOutgoing}
      stageLabels={stageLabels}
      globalCollapsed={globalCollapsed}
      onTakeContract={handleTakeContract}
      onAcceptContract={handleAcceptContract}
      onRejectContract={handleRejectContract}
      onReturnToWork={handleReturnToWork}
      onSendContract={handleSendContract}
      takingContracts={takingContracts}
      renderContractTitle={renderContractTitle}
      onContractClick={onContractClick}
    />
  );

  return (
    <div className="p-2 md:p-4 h-full">
      {/* Свободные контракты */}
      {freeContracts.length > 0 && (
        <div className="mb-4">
          <div className="text-center mb-4 text-muted-foreground flex items-center justify-center gap-2 py-2 bg-muted/30 rounded-lg">
            <span>Свободные</span>
            <Badge variant="secondary" className="text-xs h-5 min-w-5 px-1 rounded-full">
              {freeContracts.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {freeContracts.map(renderFreeContract)}
          </div>
        </div>
      )}

      {/* Адресные контракты */}
      {addressedContracts.length > 0 && (
        <div className="mb-4">
          <div className="text-center mb-4 text-muted-foreground flex items-center justify-center gap-2 py-2 bg-muted/30 rounded-lg">
            <span>Адресные</span>
            <Badge variant="secondary" className="text-xs h-5 min-w-5 px-1 rounded-full">
              {addressedContracts.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {addressedContracts.map(renderAddressedContract)}
          </div>
        </div>
      )}

      {/* Пустое состояние */}
      {freeContracts.length === 0 && addressedContracts.length === 0 && (
        <div className="text-center text-muted-foreground text-xs py-4">
          {isOutgoing ? 'Нет исходящих контрактов' : 'Нет входящих контрактов'}
        </div>
      )}

      {/* Диалог отклонения */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклонение контракта</DialogTitle>
            <DialogDescription>
              Укажите причину отклонения контракта {selectedContractForReject?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Введите причину отклонения..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Отмена
              </Button>
              <Button 
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
              >
                Отклонить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Отдельный компонент карточки контракта
function ContractCard({
  contract,
  isAddressed,
  isOutgoing,
  stageLabels,
  globalCollapsed,
  onTakeContract,
  onAcceptContract,
  onRejectContract,
  onReturnToWork,
  onSendContract,
  takingContracts,
  renderContractTitle,
  onContractClick
}: {
  contract: Contract;
  isAddressed: boolean;
  isOutgoing: boolean;
  stageLabels: Record<string, string>;
  globalCollapsed: boolean;
  onTakeContract: (e: React.MouseEvent, id: number) => void;
  onAcceptContract: (e: React.MouseEvent, id: number) => void;
  onRejectContract: (e: React.MouseEvent, contract: Contract) => void;
  onReturnToWork: (e: React.MouseEvent, id: number) => void;
  onSendContract: (e: React.MouseEvent, id: number) => void;
  takingContracts: Set<number>;
  renderContractTitle: (title: string) => React.ReactNode;
  onContractClick?: (contract: Contract) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const effectiveCollapsed = globalCollapsed || isCollapsed;
  
  const isCurrentUserAssigned = contract.assignedTo?.name === "Иван";
  const isTaking = takingContracts.has(contract.id);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const handleCardClick = () => {
    if (onContractClick) {
      onContractClick(contract);
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow flex flex-col relative" 
      onClick={handleCardClick}
    >
      {/* Заголовок контракта */}
      <div className={`border-b border-border px-3 md:px-4 py-3 flex items-center justify-between ${
        isAddressed ? 'bg-blue-50/50' : 'bg-muted/20'
      }`}>
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

      {/* Содержимое карточки */}
      <div className={`px-3 md:px-4 flex gap-2 md:gap-3 min-h-0 ${effectiveCollapsed ? 'pb-2' : 'pb-4 pt-1'}`}>
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Описание */}
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
              {/* Этап */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Этап:</span>
                <span className="text-xs">{stageLabels[contract.stage]}</span>
              </div>

              {/* Заказчик */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Заказчик:</span>
                <div className="flex items-center gap-2 px-2 py-1 border border-border/30 rounded">
                  <span className="text-xs">{contract.customer.name}</span>
                  {contract.customer.isNew ? (
                    <UserPlus className="h-3 w-3 text-green-500" />
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

              {/* Информация о назначении - зависит от типа контракта */}
              {/* Для входящих контрактов показываем "от кого" */}
              {!isOutgoing && contract.assignedFrom && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">От кого:</span>
                  <div className="flex items-center gap-2 px-2 py-1 border border-border/30 rounded">
                    <span className="text-xs">{contract.assignedFrom.name} {contract.assignedFrom.department}</span>
                    <User className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
              )}
              
              {/* Для исходящих адресных контрактов показываем "кому" */}
              {isOutgoing && contract.assignedTo && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Кому:</span>
                  <div className="flex items-center gap-2 px-2 py-1 border border-border/30 rounded">
                    <span className="text-xs">{contract.assignedTo.name} {contract.assignedTo.department}</span>
                    <User className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
              )}

              {/* Время исполнения и действия */}
              <div className="border-t border-border pt-3 mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <span className="mr-2">время исполнения - осталось</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{contract.timeRemaining}</span>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex items-center gap-1">
                    {/* Для входящих свободных контрактов - только принять */}
                    {!isOutgoing && !isAddressed && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs hover:bg-green-50 hover:border-green-300 px-2 border-2 border-gray-300 rounded-md"
                        onClick={(e) => onTakeContract(e, contract.id)}
                        title="Принять в работу"
                        disabled={isTaking}
                      >
                        {isTaking ? (
                          <Hourglass className="h-4 w-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    )}

                    {/* Для входящих адресных контрактов - принять и отклонить */}
                    {!isOutgoing && isAddressed && isCurrentUserAssigned && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs hover:bg-green-50 hover:border-green-300 px-2 border-2 border-gray-300 rounded-md"
                          onClick={(e) => onAcceptContract(e, contract.id)}
                          title="Принять заявку"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs hover:bg-red-50 hover:border-red-300 px-2 border-2 border-gray-300 rounded-md"
                          onClick={(e) => onRejectContract(e, contract)}
                          title="Отклонить заявку"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}

                    {/* Для исходящих контрактов - только вернуть в работу */}
                    {isOutgoing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs hover:bg-orange-50 hover:border-orange-300 px-2 border-2 border-gray-300 rounded-md"
                        onClick={(e) => onReturnToWork(e, contract.id)}
                        title="Вернуть в работу"
                      >
                        <ArrowLeft className="h-4 w-4 text-orange-600" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}