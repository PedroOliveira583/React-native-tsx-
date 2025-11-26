import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

type Postagem = {
  id: number;
  title: string;
  body: string;
};

export default function App() {
  const [lista, setLista] = useState<Postagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [atualizando, setAtualizando] = useState(false);

  // Função que busca os dados da API
  const pegarPosts = async () => {
    try {
      const resposta = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const json = await resposta.json();
      setLista(json);
    } catch (erro) {
      console.log("Erro ao carregar API:", erro);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  useEffect(() => {
    pegarPosts();
  }, []);

  // Filtra os resultados pelo título
  const resultados = lista.filter((item) =>
    item.title.toLowerCase().includes(busca.toLowerCase())
  );

  // Tela de Loading
  if (carregando) {
    return (
      <SafeAreaView style={estilos.centro}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10, color: "#666" }}>Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <TextInput
        placeholder="Pesquisar título..."
        value={busca}
        onChangeText={setBusca}
        style={estilos.campo}
      />

      <FlatList
        data={resultados}
        keyExtractor={(item) => String(item.id)}
        onRefresh={() => {
          setAtualizando(true);
          pegarPosts();
        }}
        refreshing={atualizando}
        ListEmptyComponent={
          <Text style={estilos.vazio}>Nenhum item encontrado.</Text>
        }
        renderItem={({ item }) => (
          <View style={estilos.cartao}>
            <Text style={estilos.titulo}>{item.title}</Text>
            <Text style={estilos.conteudo}>{item.body}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#EFEFF2",
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  campo: {
    backgroundColor: "#FFF",
    margin: 15,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  cartao: {
    backgroundColor: "#FFF",
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  conteudo: {
    color: "#555",
  },

  vazio: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});
