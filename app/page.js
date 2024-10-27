'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';
import AuthProvider from '@components/AuthProvider';
import './style.css'

export default function Home() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) alert(res.error);
  };
  console.log(session);

  useEffect(() => {
    if (session) {
      fetchItems(); // Fetch items only if the user is logged in
    }
  }, [session]);

  // Fetch items from API
  const fetchItems = async () => {
    const response = await fetch('/api/items');
    const data = await response.json();
    setItems(data);
  };

  // Create a new item
  const handleCreateItem = async () => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: itemName, description: itemDesc }),
      });

      if (!res.ok) {
        throw new Error('Failed to add item');
      }

      const data = await res.json();
      setItems([...items, data]);
      setItemName('');
      setItemDesc('');
      console.log('Item added successfully:', data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Update an item
  const handleUpdateItem = async (id) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: itemName, description: itemDesc }),
      });

      if (!res.ok) {
        throw new Error('Failed to update item');
      }

      setEditingItemId(null);
      setItemName('');
      setItemDesc('');
      fetchItems();
      console.log('Item updated successfully');
    } catch (error) {
      console.error(error.message);
    }
  };

  // Delete an item
  const handleDeleteItem = async (id) => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');

      setItems(items.filter((item) => item._id !== id));
      console.log('Item deleted successfully');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="container mx-auto">
        {session ? (
          <div class="login" className={styles.userInfo}>
            <h1 class="email">
              Welcome, <span>{session.user.name || "User"}</span>
            </h1>
            <p class="email">
              Email: <span>{session.user.email}</span>
            </p>
            <button class="btn logout" onClick={() => signOut()}>
              Logout
            </button>

            <h2 class="email"> All Items Here</h2>
            <div>
              {items.map((item) => (
                <div key={item._id}>
                  <h3 class="email">
                    {" "}
                    Item name : <span>{item.name}</span>
                  </h3>
                  <p class="email">
                    Item description : <span>{item.description}</span>
                  </p>
                  <div class="btn-flex">
                    <button
                      class="btn"
                      onClick={() => {
                        setEditingItemId(item._id);
                        setItemName(item.name);
                        setItemDesc(item.description);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      class="btn"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h3 class="email">{editingItemId ? "Edit Item" : "Add Item"}</h3>
            <div class="input-align">
              <input
                class="all-input"
                type="text"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <input
                class="all-input"
                type="text"
                placeholder="Description"
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
              />
              <button
                class="btn"
                onClick={() => {
                  if (editingItemId) {
                    handleUpdateItem(editingItemId);
                  } else {
                    handleCreateItem();
                  }
                }}
              >
                {editingItemId ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 class="email login">{isSignUp ? "Sign Up" : "Login"}</h1>
            <form class="form" onSubmit={handleSubmit} className={styles.form}>
              <label class="label">
                Email:
                <br />
                <input
                  class="all-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label class="label">
                Password:
                <br />
                <input
                  class="all-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button class="btn" type="submit">
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>
            <p class="email">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}

              <button class="btn" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </>
        )}
      </div>
    </>
  );
}
