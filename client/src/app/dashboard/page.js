"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TrashIcon from "@/components/icons/TrashIcon";
import { apiFetch, clearToken, getToken } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = getToken();

      if (!token) {
        router.replace("/signin");
        return;
      }

      try {
        setPageLoading(true);
        setError("");

        const [
          { res: userRes, data: userData },
          { res: propertiesRes, data: propertiesData },
          { res: favouritesRes, data: favouritesData },
        ] = await Promise.all([
          apiFetch("/users/me", { token }),
          apiFetch("/properties/all-properties", { token }),
          apiFetch("/favourites/all", { token }),
        ]);

        if (
          userRes.status === 401 ||
          propertiesRes.status === 401 ||
          favouritesRes.status === 401
        ) {
          clearToken();
          router.replace("/signin");
          return;
        }

        if (!userRes.ok || !propertiesRes.ok || !favouritesRes.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        setUser(userData?.user || null);

        setProperties(
          Array.isArray(propertiesData?.data)
            ? propertiesData.data
            : Array.isArray(propertiesData?.properties)
              ? propertiesData.properties
              : Array.isArray(propertiesData)
                ? propertiesData
                : [],
        );

        setFavourites(
          Array.isArray(favouritesData?.data)
            ? favouritesData.data
            : Array.isArray(favouritesData?.favourites)
              ? favouritesData.favourites
              : Array.isArray(favouritesData)
                ? favouritesData
                : [],
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const getFavouritePropertyId = (fav) => {
    return (
      fav?.propertyId ||
      fav?.property_id ||
      fav?.property?.id ||
      fav?.Property?.id ||
      null
    );
  };

  const favouritePropertyIds = useMemo(() => {
    return new Set(
      favourites.map((fav) => getFavouritePropertyId(fav)).filter(Boolean),
    );
  }, [favourites]);

  const handleToggleFavourite = async (propertyId) => {
    const token = getToken();

    if (!token) {
      router.replace("/signin");
      return;
    }

    const isAlreadyFavourite = favouritePropertyIds.has(propertyId);

    try {
      setActionLoadingId(propertyId);
      setError("");

      let res;
      let responseData;

      if (isAlreadyFavourite) {
        ({ res, data: responseData } = await apiFetch(
          `/favourites/${propertyId}`,
          {
            method: "DELETE",
            token,
          },
        ));
      } else {
        ({ res, data: responseData } = await apiFetch("/favourites/add", {
          method: "POST",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        }));
      }

      if (res.status === 401) {
        clearToken();
        router.replace("/signin");
        return;
      }

      if (!res.ok) {
        throw new Error(responseData?.message || "Something went wrong.");
      }

      if (isAlreadyFavourite) {
        setFavourites((prev) =>
          prev.filter((fav) => getFavouritePropertyId(fav) !== propertyId),
        );
      } else {
        const selectedProperty = properties.find((p) => p.id === propertyId);

        setFavourites((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            propertyId,
            property: selectedProperty || null,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.replace("/signin");
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 container mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-black/70">Welcome {user?.fullname}</p>
        </div>

        <button
          onClick={handleLogout}
          className="border border-black/20 px-4 py-2 rounded-lg hover:bg-black hover:text-white transition"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-black/10 p-4 rounded-2xl">
          <p className="text-sm text-black/50">Name</p>
          <h2 className="text-lg font-semibold">{user?.fullname}</h2>
        </div>

        <div className="border border-black/10 p-4 rounded-2xl">
          <p className="text-sm text-black/50">Role</p>
          <h2 className="text-lg font-semibold">{user?.role}</h2>
        </div>

        <div className="border border-black/10 p-4 rounded-2xl">
          <p className="text-sm text-black/50">Favourites</p>
          <h2 className="text-lg font-semibold">{favourites.length}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="border border-black/10 rounded-2xl p-5">
          <h2 className="text-xl font-semibold mb-4">Properties</h2>

          {properties.length === 0 ? (
            <p className="text-black/50">No properties found.</p>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => {
                const isFav = favouritePropertyIds.has(property.id);

                return (
                  <div
                    key={property.id}
                    className="border border-black/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        {property.title}
                      </h3>
                      <p className="text-sm text-black/60">
                        {property.location}
                      </p>
                      <p className="text-sm mt-1">Rs. {property.price}</p>
                      <p className="text-sm text-black/60 mt-1">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </p>
                      {property.description && (
                        <p className="text-sm text-black/50 mt-2">
                          {property.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleFavourite(property.id)}
                      disabled={actionLoadingId === property.id}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        isFav
                          ? "text-red-600 border border-red-200 hover:bg-red-50"
                          : "border border-black/15 hover:bg-black hover:text-white"
                      } ${
                        actionLoadingId === property.id
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {actionLoadingId === property.id ? (
                        "Updating..."
                      ) : isFav ? (
                        <>
                          <TrashIcon />
                          Remove
                        </>
                      ) : (
                        "Add Favourite"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border border-black/10 rounded-2xl p-5">
          <h2 className="text-xl font-semibold mb-4">My Favourites</h2>

          {favourites.length === 0 ? (
            <p className="text-black/50">No favourites found.</p>
          ) : (
            <div className="space-y-4">
              {favourites.map((fav, index) => {
                const propertyId = getFavouritePropertyId(fav);
                const property =
                  fav?.property ||
                  fav?.Property ||
                  properties.find((p) => p.id === propertyId) ||
                  {};

                return (
                  <div
                    key={fav.id || propertyId || index}
                    className="border border-black/10 rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-lg">
                      {property.title || "Favourite Property"}
                    </h3>
                    <p className="text-sm text-black/60">
                      {property.location || "Location not available"}
                    </p>
                    {property.price && (
                      <p className="text-sm mt-1">Rs. {property.price}</p>
                    )}
                    {(property.bedrooms || property.bathrooms) && (
                      <p className="text-sm text-black/60 mt-1">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </p>
                    )}

                    <button
                      onClick={() => handleToggleFavourite(propertyId)}
                      disabled={actionLoadingId === propertyId}
                      className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition ${
                        actionLoadingId === propertyId
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {actionLoadingId === propertyId ? (
                        "Removing..."
                      ) : (
                        <>
                          <TrashIcon />
                          Remove
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
