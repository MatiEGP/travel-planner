import re

with open('src/features/actividades/components/ActividadForm.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("setFormData({ nombre: '', fecha: '', hora: '', notas: '' });", "setFormData({ nombre: '', fecha: '', hora: '', notas: '', destinoId: 0 });")

c = re.sub(
    r'<PopoverDatePicker[\s\S]*?date=\{formData\.fecha \? new Date\([\s\S]*?className="w-full"\s*/>',
    '<PopoverDatePicker date={formData.fecha} onChange={(date) => setFormData({ ...formData, fecha: date })} minDate={fechaInicio} maxDate={fechaFin} placeholder="Seleccionar..." />',
    c
)

with open('src/features/actividades/components/ActividadForm.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
