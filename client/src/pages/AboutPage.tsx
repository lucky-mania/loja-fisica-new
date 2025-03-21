export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section id="about">
        <h2 className="text-3xl font-heading font-bold mb-8 text-neutral-dark">Sobre Nossa Loja</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Nossa Loja" 
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-heading font-semibold mb-4">Nossa História</h3>
              <p className="mb-4 text-neutral-dark">Fundada em 2015, nossa loja nasceu da paixão por moda e qualidade. Começamos como uma pequena boutique e hoje atendemos clientes em todo o Brasil.</p>
              <p className="mb-4 text-neutral-dark">Nosso compromisso é oferecer peças exclusivas, confortáveis e com estilo, sempre respeitando a sustentabilidade e a ética na produção.</p>
              <p className="text-neutral-dark">Cada peça é selecionada com cuidado para garantir que nossos clientes tenham acesso ao melhor da moda contemporânea.</p>
              
              <div className="mt-6">
                <h4 className="text-xl font-heading font-semibold mb-2">Entre em Contato</h4>
                <p className="flex items-center mb-2">
                  <span className="material-icons mr-2 text-primary">location_on</span>
                  <span>Av. Exemplo, 123 - São Paulo, SP</span>
                </p>
                <p className="flex items-center mb-2">
                  <span className="material-icons mr-2 text-primary">phone</span>
                  <span>(11) 98765-4321</span>
                </p>
                <p className="flex items-center">
                  <span className="material-icons mr-2 text-primary">email</span>
                  <span>contato@fashionstore.com.br</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
