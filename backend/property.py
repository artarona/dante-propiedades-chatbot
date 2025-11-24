from dataclasses import dataclass
from typing import Optional

@dataclass
class Property:
    id_temporal: str
    titulo: str
    barrio: str
    tipo: str
    precio: float
    moneda_precio: str
    ambientes: int
    direccion: str
    descripcion: str
    imagenes: list = None
    
    def __post_init__(self):
        if self.imagenes is None:
            self.imagenes = []
    
    def to_dict(self):
        return {
            'id_temporal': self.id_temporal,
            'titulo': self.titulo,
            'barrio': self.barrio,
            'tipo': self.tipo,
            'precio': self.precio,
            'moneda_precio': self.moneda_precio,
            'ambientes': self.ambientes,
            'direccion': self.direccion,
            'descripcion': self.descripcion,
            'imagenes': self.imagenes
        }