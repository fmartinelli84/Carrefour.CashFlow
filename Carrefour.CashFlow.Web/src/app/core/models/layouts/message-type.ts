export enum MessageType {
  Information = 1,
  Success = 2,
  Warning = 3,
  Error = 4
}

export module MessageType {
  export function toDisplayName(value: MessageType): string {
    switch (value) {
      case MessageType.Information:
        return `Informação`;
      case MessageType.Success:
        return `Sucesso`;
      case MessageType.Warning:
        return `Atenção`;
      case MessageType.Error:
        return `Erro`;
      default:
        return null;
    }
  }

  export function toName(value: MessageType): 'Information' | 'Success' | 'Warning' | 'Error' {
    switch (value) {
      case MessageType.Information:
        return 'Information';
      case MessageType.Success:
        return 'Success';
      case MessageType.Warning:
        return 'Warning';
      case MessageType.Error:
        return 'Error';
      default:
        return null;
    }
  }

  export function fromName(value: 'Information' | 'Success' | 'Warning' | 'Error'): MessageType {
    switch (value) {
      case 'Information':
        return MessageType.Information;
      case 'Success':
        return MessageType.Success;
      case 'Warning':
        return MessageType.Warning;
      case 'Error':
        return MessageType.Error;
      default:
        return null;
    }
  }
}
